class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        this.points = pointValue
        this.moveSpeed = game.settings.spaceshipSpeed
        this.isPowerShip = false 
        this.normalTint = 0xFFFFFF
        this.powerTint = 0x0000FF
    }

    update() {
        this.x -= this.moveSpeed

        if (this.x <= 0 - this.width) {
            this.x = game.config.width
        }
    }

    reset() {
        this.x = game.config.width
    }

    makePowerShip() {
        this.isPowerShip = true 
        this.setTint(this.powerTint)
    }

    clearPowerShip() {
        this.isPowerShip = false 
        this.clearTint()
    }
}