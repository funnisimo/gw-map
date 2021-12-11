import 'jest-extended';
import * as Skill from './skill';

describe('Skills', function () {
    let skills: Skill.Skills;

    beforeEach(() => {
        skills = new Skill.Skills();
    });

    describe('Skill - boolean', function () {
        test('is created without giving proficiency', function () {
            expect(skills.get('diving')).toMatchObject({
                name: 'diving',
                has: false,
                level: 0,
            });
        });

        test('can be set with false values', function () {
            const s = skills.set('diving', false);
            expect(skills.get('diving')).toBe(s);
            expect(s).toMatchObject({ has: false, level: 0 });
        });

        test('can be created with proficiency', function () {
            const s = skills.set('diving', true);
            expect(s).toMatchObject({ has: true, level: 0 });

            skills.set('diving', true);
            expect(s.has).toBeTruthy();
            skills.set('diving', false);
            expect(s.has).toBeFalsy();
        });

        test('can be adjusted to proficient 2', function () {
            const s = skills.adjust('diving', { has: true });
            expect(s.has).toBeTruthy();
            skills.adjust('diving', {});
            expect(s.has).toBeTruthy();
            skills.adjust('diving', { has: false });
            expect(s.has).toBeFalsy();
        });

        test('can have advantage changed', function () {
            const s = skills.adjust('diving', { advantage: true });
            expect(s.has).toBeFalsy();
            expect(s.advantage).toBeTruthy();
            skills.adjust('diving', {});
            expect(s.advantage).toBeTruthy();
            skills.adjust('diving', { advantage: false });
            expect(s.advantage).toBeFalsy();
        });

        test('can have disadvantage changed', function () {
            const s = skills.adjust('diving', { disadvantage: true });
            expect(s).toMatchObject({ has: false, disadvantage: true });

            skills.adjust('diving', {});
            expect(s.disadvantage).toBeTruthy();
            skills.adjust('diving', { disadvantage: false });
            expect(s.disadvantage).toBeFalsy();
        });

        test('can have fixed changed, always keeping the best (not the last)', function () {
            const s = skills.set('diving', true);
            expect(s).toMatchObject({ has: true, level: 0 });

            skills.adjust('diving', { fixed: 3 });
            expect(s.fixed).toEqual(3);
            expect(s.level).toEqual(0);

            skills.adjust('diving', {});
            expect(s.fixed).toEqual(3);
            expect(s.level).toEqual(0);

            skills.adjust('diving', { fixed: 2 });
            expect(s.fixed).toEqual(3);
            expect(s.level).toEqual(0);

            skills.adjust('diving', { fixed: 4 });
            expect(s.fixed).toEqual(4);
            expect(s.level).toEqual(0);
        });

        test('can have bonus changed, always adding', function () {
            const s = skills.adjust('diving', { bonus: 1 });
            expect(s.bonus).toEqual(1);
            skills.adjust('diving', {});
            expect(s.bonus).toEqual(1);
            skills.adjust('diving', { bonus: 1 });
            expect(s.bonus).toEqual(2);
            skills.adjust('diving', { bonus: -1 });
            expect(s.bonus).toEqual(1);
            skills.adjust('diving', { bonus: 2 });
            expect(s.bonus).toEqual(3);
        });

        test('can be set to always succeed', function () {
            const s = skills.adjust('diving', { succeed: true });
            expect(s.succeed).toBeTruthy();
            skills.adjust('diving', {});
            expect(s.succeed).toBeTruthy();
            skills.adjust('diving', { succeed: false });
            expect(s.succeed).toBeFalsy();
        });

        test('can be set to always fail', function () {
            const s = skills.adjust('diving', { fail: true });
            expect(s.fail).toBeTruthy();
            skills.adjust('diving', {});
            expect(s.fail).toBeTruthy();
            skills.adjust('diving', { fail: false });
            expect(s.fail).toBeFalsy();
        });

        //     // TODO - add cursed adjustments
        //     // - has prefers false if cursed
        //     // - advantage prefers false if cursed
        //     // - disadvantage prefers true if cursed
        //     // - fixed prefers lower if cursed
        //     // - bonus works the same
        // });
    });
    describe('Skills - numeric', function () {
        beforeEach(() => {
            skills.set('hide', 10);
        });

        test('allows adding base skills', function () {
            const s = skills.set('test', 10);
            expect(skills.get('test')).toBe(s);
            expect(s).toMatchObject({ has: true, level: 10 });

            const s2 = skills.set('test2', 20);
            expect(s2.level).toEqual(20);
        });

        //     describe('adjust', function () {
        //         test('allows adjustment of non-existing skills', function () {
        //             expect(skills.get('missing')).toBeUndefined();
        //             skills.adjust('missing', { disadvantage: true });
        //             expect(skills.get('missing')).toEqual(0);
        //             expect(skills.disadvantage('missin')).toBeTruthy();
        //         });

        test('adjusts with name and number', function () {
            const s = skills.adjust('hide', 1);
            expect(s.bonus).toEqual(1);
            skills.adjust('hide', 1);
            expect(s.bonus).toEqual(2);
        });

        //         test('adjusts with name and object', function () {
        //             expect(skills.bonus('hide')).toBeUndefined();
        //             skills.adjust('hide', { bonus: 1 });
        //             expect(skills.bonus('hide')).toEqual(1);
        //             skills.clearAdjustment('hide', { bonus: 1 });
        //             expect(skills.bonus('hide')).toBeUndefined();
        //         });

        //         test('adjusts with name and object', function () {
        //             expect(skills.bonus('hide')).toBeUndefined();
        //             skills.adjust('hide', { bonus: 1 });
        //             expect(skills.bonus('hide')).toEqual(1);
        //             skills.clearAdjustment('hide', { bonus: 1 });
        //             expect(skills.bonus('hide')).toBeUndefined();
        //         });

        //         test('adjusts all saves', function () {
        //             expect(skills.get('saves')).toBeUndefined();
        //             skills.adjust({ saves: 1 });
        //             expect(skills.get('saves').bonus('diving')).toEqual(1);
        //             skills.clearAdjustment({ saves: 1 });
        //             expect(skills.get('saves').bonus('diving')).toBeUndefined();
        //         });

        //         test('can adjust things to false', function () {
        //             expect(skills.get('defense')).toBeUndefined();
        //             skills.adjust({ defense: { criticalDamage: false } });
        //             expect(skills.get('defense').criticalDamage).toEqual(false);
        //             skills.clearAdjustment({ defense: { criticalDamage: false } });
        //             expect(skills.get('defense').criticalDamage).toBeUndefined();
        //         });

        //         test('can adjust things to false', function () {
        //             expect(skills.get('defense', 'critical')).toBeUndefined();
        //             skills.adjust({ 'defense.critical': { bonus: 1 } });
        //             skills.adjust({ 'defense.critical': { bonus: 1 } });
        //             expect(
        //                 skills.get('defense', 'critical').bonus('diving')
        //             ).toEqual(2);
        //             skills.clearAdjustment({ 'defense.critical': { bonus: 1 } });
        //             expect(
        //                 skills.get('defense', 'critical').bonus('diving')
        //             ).toEqual(1);
        //             skills.clearAdjustment({ 'defense.critical': { bonus: 1 } });
        //             expect(
        //                 skills.get('defense', 'critical').bonus('diving')
        //             ).toBeUndefined();
        //         });
        //     });

        //     // test('allows changing base', function() {
        //     //   let adjustment = { skill: 'hide', advantage: true };
        //     //   expect(skills.get('hide').advantage('diving')).toBeFalsy();
        //     //   skills.change(adjustment);
        //     //   expect(skills.get('hide').advantage('diving')).toBeTruthy();
        //     //   skills.clearAdjustment(adjustment);
        //     //   expect(skills.get('hide').advantage('diving')).toBeTruthy();
        //     // });

        //     // TODO - add cursed tests
        //     // - cursed adjustments get added to front of list
        //     // - test with 2 adjustments that can only be correct if cursed is first

        //     // TODO - removeMatching
    });

    describe('sub skills', function () {
        test('allows the addition of sub skills', function () {
            const ac = skills.adjust('athletics.climb', { bonus: 1 });
            const a = skills.get('athletics');

            expect(ac).toMatchObject({
                name: 'athletics.climb',
                bonus: 1,
            });
            expect(a).toMatchObject({
                name: 'athletics',
                has: false,
                level: 0,
            });

            skills.set('athletics', true);
            expect(a).toMatchObject({ name: 'athletics', has: true, level: 0 });
            expect(a.has).toBeTruthy();

            expect(ac).toMatchObject({
                name: 'athletics.climb',
                bonus: 1,
            });
            expect(ac._parent).toBe(a);
            expect(ac._has).toBeUndefined();
            expect(ac.has).toBeTruthy();
            expect(ac._level).toBeUndefined();
            expect(ac.level).toEqual(0);
        });

        test('sub overrides main for booleans', function () {
            const ac = skills.adjust('athletics.climb', {
                bonus: 1,
                advantage: true,
            });
            expect(ac).toMatchObject({
                bonus: 1,
                advantage: true,
            });
            const a = skills.set('athletics', true);

            expect(ac).toMatchObject({
                bonus: 1,
                advantage: true,
            });
            expect(a).toMatchObject({ has: true, level: 0 });

            expect(ac.level).toEqual(0);
            expect(ac.has).toBeTruthy();
        });

        test('bonus is additive', function () {
            const ac = skills.adjust('athletics.climb', { bonus: 1 });
            expect(ac).toMatchObject({ bonus: 1 });

            const a = skills.set('athletics', false);
            skills.adjust('athletics', { bonus: 1 });

            expect(ac.bonus).toEqual(2);
            expect(a.bonus).toEqual(1);
        });
    });
});
