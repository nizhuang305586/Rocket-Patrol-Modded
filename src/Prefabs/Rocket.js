class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        scene.add.existing(this)
        this.isFiring = false
        this.moveSpeed = 2
        this.sfxShot = scene.sound.add("sfx-shot")
        this.rapidFire = false
    }

    update() {
    // HORIZONTAL MOVEMENT (keyboard only)
        if (!this.isFiring) {
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed
            }
        }

        // KEYBOARD FIRING
        if ((Phaser.Input.Keyboard.JustDown(keyFIRE) || (this.rapidFire && keyFIRE.isDown)) && !this.isFiring) {
            this.fire()
        }

        // VERTICAL MOVEMENT
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.rapidFire ? this.moveSpeed + 4 : this.moveSpeed
        }

        // RESET ROCKET WHEN TOP IS REACHED
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.isFiring = false
            this.y = game.config.height - borderUISize - borderPadding

            // Subtract 3 seconds if the rocket missed
            if (!this.scene.gameOver) {
                this.scene.clock = Math.max(0, this.scene.clock - 3)
                this.scene.clockText.text = `Time: ${this.scene.clock}`
            }
        }
    }

    // method to fire rocket (keyboard or mouse)
    fire() {
        if (!this.isFiring) {
            this.isFiring = true
            this.sfxShot.play()
        }
    }



    reset() {
        this.isFiring = false
        this.y = game.config.height - borderUISize - borderPadding
    }



}