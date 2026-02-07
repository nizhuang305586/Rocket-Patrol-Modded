/***********************************
 * Nikolas Huang
 * Rocket Patrol MODDED
 * Approx time spent working: 7 HOURS
 * 
 * Mods Implemented:
 * - Displayed a timer clock so the player knows how long is left - 3 points
 * - Player gains +3 seconds on spaceship destroyed and -3 seconds on spaceship missed - 5 points
 * - If Player hits a blue ship that appears periodically, gain rapid fire, being able to shoot 2x faster - 5 points
 * - Divided Novice and Expert, having MOUSE CONTROL (also can move rocket while traveling) on Novice,
 *   And KEYBOARD CONTROL on Expert. - 5 points
 * - Added a new and improved menu. - 3 points
 * 
 * Total: 21
 * 
 * 
 * 
 * - All modded code and references were mixed with a lot of reading Phaser Documentation
 *   to understand JavaScript as well as special keywords within Phaser.
 * 
 * 
 */







let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

//UI sizing
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

//reserver the keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

