import * as GWU from 'gw-utils';

// TODO - Should Status accept calculations or just values?  Would affect: setCount, increment, decrement, setTime, addTime, removeTime, decayTimes
// TODO - Convenience set function?  true, [count=]#, { time: #, set: true, count: # }?

// A Status object allows us to track the state
// of various events.  It is mostly used on Beings.
// Examples of status items would be:
// * is the player currently flying?
// * poisoned?
// * confused?
// * slowed?
// * etc...
// There are three ways that you can set a status...
// 1) Set
// 2) Counts
// 3) Time
// Each of these has a different way of being tracked and
// adjusted.
// A status is considered to be active if it is "truthy".
// So you can check if something is set very easily by doing this:
// if (being.status.get('flying')) { ... }
// -----
// ON
// -----
// This is for when you want to set a status until further notice.
// It is used for things like making the player fly as long as they
// wear that ring of flying.
// To turn on a status use:
// status.setOn(<STATUS>, [DONE()]);
// To turn off a status use:
// status.setOff(STATUS>);
// -----
// COUNT
// -----
// This is for when a status can be activated or used a certain number
// of times.  It allows you to track it in once place.
// To set a count:
// status.setCount(<STATUS>, count, [DONE()]);
// To decrement/increment a count:
// status.increment(<STATUS>, [count], [DONE()]);
// status.decrement(<STATUS>, [count]);
// -----
// TIME
// -----
// This is for when a player gets someting for a limited time.
// It is up to the game to determine how time progresses, but for
// the default setting of "real-time", it is the numnber of milliseconds
// of game time that the status is set.
// To set:
// status.setTime(<STATUS>, time, [DONE()]);
// To add/remove:
// status.addTime(<STATUS>, time, [DONE()]);
// status.removeTime(<STATUS>, time);
// As the game progresses, it will decay the time values of all
// status variables automatically.  This will cause them to become unset
// whenever the time elapses.  It is done with this call:
// status.decayAllTimes(dt?);
//
// -----
// DONE
// -----
// The status object only tracks one DONE function per status.
// This is because the function should be used to apply/unapply the effects of the status and that should only occur once.
// In general, the expectation is that the same function will be used for the done function most of the time
// e.g.
// status.addTime('flying', 10, doneFlying);
// status.setOn('flying', doneFlying);
//
// It doesn't matter to the player which expires first (the time or the setting), the player will only see the
// flying stop when both are done.
//
// ---------
// GENERAL
// ---------
// Statuses are often used to track other changes and to undo them.
// e.g. - potion of strength
//        add 5 to the player's strength (not additive)
// if (!player.status.has('strength')) {
//     player.attributes.addBonus('str', 5);
// }
// player.status.addTime('strength', 10, () => {
//     player.attributes.clearBonus('str', 5);
// });
//

export type StatusCallback = (status: Status, name: string) => any;

export class Status {
    _set: Record<string, boolean> = {};
    _time: Record<string, number> = {};
    _count: Record<string, number> = {};
    _done: Record<string, StatusCallback | null> = {};
    _value: Record<string, boolean> = {};
    changed: StatusCallback | null = null;

    clear(name: string): boolean {
        this.clearTime(name);
        this.clearCount(name);
        this.setOff(name);
        return this._update(name);
    }

    get(name: string): boolean {
        return this._value[name] || false;
    }

    has(name: string): boolean {
        return this._value[name] || false;
    }

    _addDone(name: string, done?: StatusCallback) {
        if (done) {
            if (!this._done[name]) {
                this._done[name] = done;
            }
        }
    }

    /**
     * Sets the count for a status variable.
     * If setting the count turns on the status (it was off),
     * then this function returns true.  Otherwise, false.
     * The done variable is only set if there is no other done function
     * already for this status.
     * @param {string} name The name of the status to set.
     * @param {number} count The count to set.
     * @param {function} [done] The function to call whenever the count goes to 0.
     * @returns {boolean} Whether or not setting the count turned the status on.
     */
    setCount(name: string, count: number, done: StatusCallback) {
        const status = this;

        status._count[name] = Math.max(count, status._count[name] || 0);
        this._addDone(name, done);
        return this._update(name);
    }

    /**
     * Increments the count for the status by the given amount (1=default)
     * If incrementing the count turns on the status (it was off),
     * then this function returns true.  Otherwise, false.
     * The done variable is only set if there is no other done function
     * already for this status.
     * @param {string} name The name of the status to set.
     * @param {number} [count=1] The count to incrmeent.
     * @param {function} [done] The function to call whenever the count goes to 0.
     * @returns {boolean} Whether or not incrementing the count turned the status on.
     */
    increment(name: string, count = 1, done?: StatusCallback) {
        if (typeof count == 'function') {
            done = count;
            count = 1;
        }
        const status = this;

        status._count[name] = (status._count[name] || 0) + count;
        this._addDone(name, done);
        return this._update(name);
    }

    /**
     * Decrements the count for the status by the given amount (1=default)
     * If decrementing the count turns off the status (it was on),
     * then this function returns true.  Otherwise, false.
     * Also, if the status is turned off, and a done function was set, then it
     * is called.
     * @param {string} name The name of the status to adjust.
     * @param {number} [count=1] The count to decrement.
     * @returns {boolean} Whether or not decrementing the count turned the status off.
     */
    decrement(name: string, count = 1) {
        const status = this;

        status._count[name] = Math.max(0, (status._count[name] || 0) - count);
        return this._update(name);
    }

    /**
     * Clears all counts from the given status.
     * If clearing the count turns off the status (it was on),
     * then this function returns true.  Otherwise, false.
     * Also, if the status is turned off, and a done function was set, then it
     * is called.
     * @param {string} name The name of the status to adjust.
     * @returns {boolean} Whether or not decrementing the count turned the status off.
     */
    clearCount(name: string) {
        const status = this;

        status._count[name] = 0;
        return this._update(name);
    }

    /**
     * Turns on the given status.
     * @param {string} name The status to adjust.
     * @param {function} [done] The function to call when the status is turned off.
     * @returns {boolean} True if this turns on the status. (It could be on because of a time or count).
     */
    setOn(name: string, done?: StatusCallback) {
        const status = this;

        status._set[name] = true;
        this._addDone(name, done);
        return this._update(name);
    }

    /**
     * Turns off the given status.
     *
     * @param {string} name The status to adjust.
     * @returns {boolean} True if this turns off the status. (It could be on because of a time or count).
     */
    setOff(name: string) {
        const status = this;
        status._set[name] = false;
        return this._update(name);
    }

    /**
     * Sets the time for a status variable.
     * If setting the time turns on the status (it was off),
     * then this function returns true.  Otherwise, false.
     * The done variable is only set if there is no other done function
     * already for this status.
     * @param {string} name The name of the status to set.
     * @param {GWU.range.RangeBase} time The time value to set.
     * @param {function} [done] The function to call whenever the status goes false.
     * @returns {boolean} Whether or not setting the time turned the status on.
     */
    setTime(name: string, value: GWU.range.RangeBase, done?: StatusCallback) {
        const status = this;
        // if (value === true) {
        //   return RUT.Status.setOn(source, name, done);
        // }
        value = GWU.range.make(value).value();
        const current = status._time[name] || 0;
        status._time[name] = Math.max(value, current);
        this._addDone(name, done);
        return this._update(name);
    }

    /**
     * Adds to the time for a status variable.
     * If adding to the time turns on the status (it was off),
     * then this function returns true.  Otherwise, false.
     * The done variable is only set if there is no other done function
     * already for this status.
     * @param {string} name The name of the status to set.
     * @param {GWU.range.RangeBase} time The time value to add.
     * @param {function} [done] The function to call whenever the status goes false.
     * @returns {boolean} Whether or not adding the time turned the status on.
     */
    addTime(
        name: string,
        value: GWU.range.RangeBase = 1,
        done?: StatusCallback
    ) {
        if (typeof value == 'function') {
            done = value;
            value = 1;
        }
        const status = this;
        // if (value === true) {
        //   return RUT.Status.setOn(source, name, done);
        // }
        value = GWU.range.make(value).value();
        status._time[name] = (status._time[name] || 0) + value;
        this._addDone(name, done);
        return this._update(name);
    }

    /**
     * Removes time for a status variable.
     * If removing to the time turns off the status (it was on),
     * then this function returns true.  Otherwise, false.
     * @param {string} name The name of the status to set.
     * @param {GWU.range.RangeBase} time The time value to remove.
     * @returns {boolean} Whether or not removing the time turned the status off.
     */
    removeTime(name: string, value: GWU.range.RangeBase = 1) {
        const status = this;

        value = GWU.range.make(value).value();
        status._time[name] = Math.max(0, (status._time[name] || 0) - value);
        return this._update(name);
    }

    /**
     * Removes all time for a status variable.
     * If removing to the time turns off the status (it was on),
     * then this function returns true.  Otherwise, false.
     * @param {string} name The name of the status to set.
     * @returns {boolean} Whether or not removing the time turned the status off.
     */
    clearTime(name: string) {
        const status = this;
        status._time[name] = 0;
        return this._update(name);
    }

    /**
     * Removes time for all status variables that have time.
     * If removing the time turns off any status (it was on),
     * then this function returns an object with all of those statuses as keys and false as the values.  Otherwise, false.
     * @param {Status|object} source The object to set the status on.  If object.status is set then that is where the values are updated.
     * @param {string} name The name of the status to set.
     * @returns {boolean|object} false or an object with the names of the statuses that were cleared as keys and false as the values.
     */
    decayAllTimes(delta = 1) {
        const status = this;

        const cleared: Record<string, boolean> = {};
        let noticed = false;
        for (let name in status._time) {
            if (this.removeTime(name, delta)) {
                noticed = true;
                cleared[name] = false;
            }
        }
        return noticed ? cleared : false;
    }

    /**
     * Updates the value of the status and returns whether or not this change
     * turned the status on or off (true = change, false = no change)
     * @param {string} name The name of the status to update
     * @returns {boolean} True if the value was turned on or off, False otherwise.
     */
    _update(name: string): boolean {
        const status = this;

        const rec = this._value;
        let was = rec[name];
        let value = (rec[name] =
            status._set[name] ||
            status._time[name] > 0 ||
            status._count[name] > 0 ||
            false);
        const doneFn = this._done[name];
        if (!value && doneFn) {
            doneFn(this, name);
            status._done[name] = null;
        }
        if (was && !value) {
            if (this.changed) this.changed(this, name);
            // console.log('called changed: false');
            return true;
        } else if (!was && value) {
            if (this.changed) this.changed(this, name);
            // console.log('called changed: true');
            return true;
        }
        return false;
    }
}
