class Play extends Phaser.Scene {
    constructor() {
        super('PlayScene')
    }

    create() {
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        //green ui background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)  
        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0) 
        //add rocket
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, "rocket").setOrigin(0.5, 0)


        //add spaceships (x3)
          this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0)
  this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)
  this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)
        //define new keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        
        if (game.settings.inputMode === "mouse") {
            this.input.mouse.disableContextMenu()

            this.input.on("pointerdown", () => {
                if (!this.gameOver) {
                    this.p1Rocket.fire()
                }
            })
        }   

        this.p1Score = 0

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)
        
        //Game Over Bool Flag
        this.gameOver = false

        // 60-second play clock
        scoreConfig.fixedWidth = 0
        
        //initialize clock (seconds)
        this.clock = game.settings.gameTimer / 1000

        //display the clock
        this.clockText = this.add.text(
            game.config.width / 2 + 140,
            borderUISize + borderPadding * 2,
            `Time: ${this.clock}`,
            scoreConfig
        )

        // Countdown timer: subtract 1 every second
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.gameOver) {
                    this.clock--;
                    this.clockText.text = `Time: ${this.clock}`;

                    if (this.clock <= 0) {
                        // Time's up → game over
                        this.gameOver = true

                        // Show Game Over messages
                        let endConfig = { ...scoreConfig }
                        endConfig.fixedWidth = 0

                        this.add.text(
                            game.config.width / 2,
                            game.config.height / 2,
                            'GAME OVER',
                            endConfig
                        ).setOrigin(0.5)

                        this.add.text(
                            game.config.width / 2,
                            game.config.height / 2 + 64,
                            'Press (R) to Restart or <- for Menu',
                            endConfig
                        ).setOrigin(0.5)
                    }
                }
            },
            callbackScope: this,
            loop: true      // repeat every second
        });

        this.rapidFireActive = false 
        
        this.powerShipTimer = this.time.addEvent({
            delay: 8000,
            callback: () => {
                this.ship01.clearPowerShip()
                this.ship02.clearPowerShip()
                this.ship03.clearPowerShip()

                let ships = [this.ship01, this.ship02, this.ship03]
                let chosen = Phaser.Utils.Array.GetRandom(ships)
                chosen.makePowerShip()
            },
            loop: true
        })

    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }
        
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("MenuScene")
        }

        this.starfield.tilePositionX -= 4
        this.p1Rocket.update()
        this.ship01.update()
        this.ship02.update()
        this.ship03.update()

        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.explodeShip(this.ship03)
        }

        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.explodeShip(this.ship02)
        }

        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.explodeShip(this.ship01)
        }

        if (!this.gameOver) {
            this.p1Rocket.update()
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
        }

        if (!this.gameOver) {
            if (game.settings.inputMode === "keyboard") {
                this.p1Rocket.update()
            } else if (game.settings.inputMode === "mouse") {
                let pointerX = this.input.activePointer.x
                let minX = borderUISize + this.p1Rocket.width
                let maxX = game.config.width - borderUISize - this.p1Rocket.width
                this.p1Rocket.x = Phaser.Math.Clamp(pointerX, minX, maxX)

                this.p1Rocket.update()
            }
        }
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true
        } else {
            return false
        }
    }

    explodeShip(ship) {
        if (ship.isPowerShip === true) {
            console.log("Power ship hit", this.p1Rocket)
            this.activateRapidFire()
            ship.clearPowerShip()
        }

        ship.alpha = 0
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')             // play explode animation
        boom.on('animationcomplete', () => {   // callback after anim completes
            ship.reset()                         // reset ship position
            ship.alpha = 1                       // make ship visible again
            boom.destroy()                       // remove explosion sprite
        })

        this.clock += 3;
        this.clockText.text = `Time: ${this.clock}`;
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score

        this.sound.play("sfx-explosion")
    }

    activateRapidFire() {
        if (this.rapidFireActive) return

        this.rapidFireActive = true 
        this.p1Rocket.rapidFire = true 
        this.p1Rocket.setTint(0x00FFFF)

        this.time.delayedCall(4000, () => {
            this.rapidFireActive = false 
            this.p1Rocket.rapidFire = false
            this.p1Rocket.clearTint()
        })
    }
}