var MAP;
var UI;
var LAYER;
var PLAYER;
var animator;

const CellFlags = GWM.flags.Cell;

GWU.rng.random.seed(12345);
// GWD.dig.room.install('HUGE_ROOM',     GWD.dig.room.rectangular,  { width: [50,76], height: [15,28] });

let command = showHit;
let isGameTime = false;

async function movePlayer(e) {
    if (!e.dir) return false;

    const newX = PLAYER.x + e.dir[0];
    const newY = PLAYER.y + e.dir[1];

    if (MAP.hasEntityFlag(newX, newY, GWM.flags.Entity.L_BLOCKS_MOVE))
        return false;

    await MAP.removeActor(PLAYER);
    await MAP.addActor(newX, newY, PLAYER);
    await MAP.tick(50);
    return true;
}

function toggleGameTime() {
    isGameTime = (isGameTime + 1) % 2;
    let text;
    if (isGameTime) {
        text = 'Selected GAME TIME.';
        animator = MAP;
    } else {
        text = 'Selected REAL TIME.';
        animator = LAYER;
    }
    UI.alert(500, text);
    return true;
}

function selectWall() {
    command = toggleWall;
    UI.alert(500, 'Selected WALL.');
    return true;
}

function selectBeam() {
    command = showBeam;
    UI.alert(500, 'Selected BEAM.');
    return true;
}

function selectFlash() {
    command = showFlash;
    UI.alert(500, 'Selected FLASH.');
    return true;
}

function selectBolt() {
    command = showBolt;
    UI.alert(500, 'Selected BOLT.');
    return true;
}

function selectHit() {
    command = showHit;
    UI.alert(500, 'Selected HIT.');
    return true;
}

function selectAura() {
    command = showAura;
    UI.alert(500, 'Selected AURA.');
    return true;
}

function selectExplosion() {
    command = showExplosion;
    UI.alert(500, 'Selected EXPLOSION.');
    return true;
}

function selectExplosionStar() {
    command = showExplosionStar;
    UI.alert(500, 'Selected STAR.');
    return true;
}

function selectExplosionPlus() {
    command = showExplosionPlus;
    UI.alert(500, 'Selected PLUS.');
    return true;
}

function selectExplosionX() {
    command = showExplosionX;
    UI.alert(500, 'Selected X.');
    return true;
}

function selectProjectile() {
    command = showProjectile;
    UI.alert(500, 'Selected PROJECTILE.');
    return true;
}

function showFX(e) {
    console.log('click', e.x, e.y);
    if (e.x != PLAYER.x || e.y != PLAYER.y) {
        const r = command(e);
        MAP.tick(50);
        return r;
    }
}

function showFlash(e) {
    GWM.fx.flashSprite(MAP, e.x, e.y, 'bump', 200, 3);
}

function showHit(e) {
    GWM.fx.hit(MAP, e, 'hit', 100, LAYER);
}

function showBeam(e) {
    GWM.fx
        .beam(MAP, PLAYER, { x: e.x, y: e.y }, 'lightning', {
            speed: 8,
            fade: 100,
            animator,
        })
        .then((anim) => {
            console.log('beam end: ', anim.x, anim.y);
            return GWM.fx.hit(MAP, anim, 'hit', 100, LAYER);
        })
        .then(() => {
            console.log('- beam hit done');
        });
}

GWU.sprite.install('lightning', '\u16f6', [200, 200, 200]);

function showBolt(e) {
    GWM.fx
        .bolt(MAP, PLAYER, { x: e.x, y: e.y }, 'magic', {
            speed: 2,
            fade: 100,
            animator,
        })
        .then((result) => {
            console.log('bolt hit:', result.x, result.y);
            return GWM.fx.flashSprite(
                MAP,
                result.x,
                result.y,
                'hit',
                100,
                3,
                LAYER
            );
        })
        .then(() => {
            console.log('- hit done.');
        });
}

GWU.sprite.install('magic', '*', 'purple');

const PROJECTILE = GWU.sprite.make('|-\\/', 'orange', null); // null makes sprite with ch.length > 1 possible

function showProjectile(e) {
    GWM.fx
        .projectile(MAP, PLAYER, { x: e.x, y: e.y }, PROJECTILE, {
            duration: 500,
            fade: 100,
            animator,
        })
        .then((anim) => {
            console.log('projectile hit:', anim.x, anim.y);
            return GWM.fx.flashSprite(
                MAP,
                anim.x,
                anim.y,
                'hit',
                500,
                1,
                LAYER
            );
        });
}

function showAura(e) {
    GWM.fx.explosion(MAP, e.x, e.y, 3, 'magic', {
        shape: 'o',
        center: false,
        animator,
    });
}

function showExplosion(e) {
    GWM.fx.explosion(MAP, e.x, e.y, 7, 'fireball', { animator, speed: 2 });
}

GWU.sprite.install('fireball', '&', 'dark_red', 0x300, 50);

function showExplosionPlus(e) {
    GWM.fx.explosion(MAP, e.x, e.y, 7, 'fireball', {
        animator,
        shape: '+',
    });
}

function showExplosionX(e) {
    GWM.fx.explosion(MAP, e.x, e.y, 7, 'fireball', {
        animator,
        shape: 'x',
    });
}

function showExplosionStar(e) {
    GWM.fx.explosion(MAP, e.x, e.y, 7, 'fireball', {
        animator,
        shape: '*',
    });
}

function toggleWall(e) {
    const cell = MAP.cell(e.x, e.y);
    if (cell.hasTile('WALL')) {
        MAP.setTile(e.x, e.y, 'FLOOR');
    } else {
        MAP.setTile(e.x, e.y, 'WALL');
    }
}

function rest(e) {
    MAP.tick(50);
}

function showHelp() {
    const layer = new GWU.ui.Layer(UI);
    const buf = layer.buffer;

    let y = 2;
    buf.drawText(20, y++, 'GoblinWerks FX Example', 'green');
    y++;
    y += buf.wrapText(
        10,
        y,
        60,
        'This example allows you to try out some of the special FX in GoblinWerks.',
        'white'
    );
    y++;
    buf.drawText(
        10,
        y++,
        'ΩtealΩCLICK∆ : When you click on a tile, the current FX is played.'
    );
    buf.drawText(
        10,
        y++,
        'ΩtealΩDIR∆   : Pressing a direction key moves the player.'
    );
    y += buf.wrapText(
        10,
        y,
        60,
        'ΩtealΩSPACE∆ : Rest player - lets game time animations continue. (you could also move the player)',
        'white',
        null,
        { indent: 8 }
    );
    buf.drawText(
        10,
        y++,
        'ΩtealΩg∆     : Toggle between game time and real time FX.'
    );
    buf.drawText(10, y++, 'ΩtealΩ?∆     : Show this screen.');
    y++;
    buf.drawText(10, y++, 'FX available');
    buf.drawText(10, y++, '======================');
    buf.drawText(
        10,
        y++,
        'ΩtealΩw∆     : Enter WALL mode - clicks place/remove walls.'
    );

    buf.drawText(10, y++, 'ΩtealΩh∆     : Show a HIT on the clicked tile.');
    buf.drawText(10, y++, 'ΩtealΩf∆     : Blink a sprite on the clicked tile.');
    buf.drawText(10, y++, 'ΩtealΩb∆     : Fire a BOLT to the clicked tile.');
    buf.drawText(
        10,
        y++,
        'ΩtealΩp∆     : Fire a PROJECTILE to the clicked tile.'
    );
    buf.drawText(10, y++, 'ΩtealΩm∆     : Fire a BEAM to the clicked tile.');
    buf.drawText(
        10,
        y++,
        'ΩtealΩo∆     : Cause an explosion at the clicked tile.'
    );
    buf.drawText(10, y++, 'ΩtealΩ+∆     : Fire a + shaped explosion.');
    buf.drawText(10, y++, 'ΩtealΩx∆     : Fire an X shaped explosion.');
    buf.drawText(10, y++, 'ΩtealΩ*∆     : Fire a * shaped explosion.');
    buf.drawText(
        10,
        y++,
        'ΩtealΩa∆     : Produce an aura (explosion w/o center).'
    );

    buf.fillRect(8, 1, 64, y, null, null, 'black');

    // UI.draw();
    buf.render();

    return layer.run({
        keypress() {
            this.finish();
        },
        click() {
            this.finish();
        },
    });
}

const KEYMAP = {
    ' ': rest,
    b: selectBolt,
    h: selectHit,
    f: selectFlash,
    p: selectProjectile,
    m: selectBeam,
    w: selectWall,
    o: selectExplosion,
    '+': selectExplosionPlus,
    '=': selectExplosionPlus,
    x: selectExplosionX,
    8: selectExplosionStar,
    '*': selectExplosionStar,
    a: selectAura,
    g: toggleGameTime,
    '?': showHelp,
};

// start the environment
async function start() {
    UI = new GWU.ui.UI({ width: 80, height: 30, div: 'game' });

    await showHelp();

    PLAYER = GWM.actor.from({
        sprite: GWU.sprite.make('@', 'white'),
        name: 'you',
        speed: 120,
        flags: 'IS_PLAYER',
    });

    PLAYER.x = 40;
    PLAYER.y = 27;

    MAP = GWM.map.make(80, 30, 'FLOOR', 'WALL');
    // MAP.locations.start = [PLAYER.x, PLAYER.y];
    await MAP.addActor(PLAYER.x, PLAYER.y, PLAYER);

    // Should just keep listening to IO

    LAYER = new GWU.ui.Layer(UI);
    animator = LAYER;

    await LAYER.run({
        dir: movePlayer,
        keypress(e) {
            const cb = GWU.io.handlerFor(e, KEYMAP);
            if (!cb) return false;
            cb.call(this, e);
            // return true;
        },
        click: showFX,
        draw() {
            if (!MAP.needsRedraw) {
                return false;
            }

            MAP.drawInto(LAYER.buffer);
            MAP.needsRedraw = false;
            LAYER.buffer.render();
        },
    });

    // MAP.drawInto(layer.buffer);
    // layer.needsDraw = true;
}

window.onload = start;
