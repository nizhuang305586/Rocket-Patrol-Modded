class Menu extends Phaser.Scene {
    constructor() {
        super("MenuScene")
    }

    preload() {
        this.load.image('rocket', './assets/rocket.png')
        this.load.image('spaceship', './assets/spaceship.png')
        this.load.image('starfield', './assets/starfield.png')
        this.load.spritesheet("explosion", "./assets/explosion.png", {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        })

        // audio
        this.load.audio("sfx-select", "./assets/sfx-select.wav")
        this.load.audio("sfx-explosion", "./assets/sfx-explosion.wav")
        this.load.audio("sfx-shot", "./assets/sfx-shot.wav")
    }

    create() {
        // background
        this.bg = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)

        // subtle vignette overlay (cheap “cinematic” look)
        this.add.rectangle(0, 0, 640, 480, 0x000000, 0.25).setOrigin(0, 0)

        // explosion anim (unchanged)
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 9, first: 0 }),
            frameRate: 24
        })

        // title styling
        const titleStyle = {
            fontFamily: 'Courier',
            fontSize: '54px',
            color: '#FFFFFF',
            align: 'center'
        }

        const subStyle = {
            fontFamily: 'Courier',
            fontSize: '18px',
            color: '#D7D7D7',
            align: 'center'
        }

        const hintStyle = {
            fontFamily: 'Courier',
            fontSize: '16px',
            color: '#B9FFB9',
            align: 'center'
        }

        // title + subtitle
        const title = this.add.text(320, 90, "ROCKET PATROL", titleStyle).setOrigin(0.5)
        title.setShadow(0, 0, "#00FFFF", 10, true, true)

        this.add.text(320, 140, "Modded Edition", subStyle).setOrigin(0.5)

        // small moving ship silhouettes for flair
        this.decorShip1 = this.add.image(660, 210, 'spaceship').setOrigin(0, 0.5).setAlpha(0.5).setScale(0.8)
        this.decorShip2 = this.add.image(700, 260, 'spaceship').setOrigin(0, 0.5).setAlpha(0.35).setScale(0.6)

        // controls text
        this.add.text(320, 185, "Novice: Mouse move + Click fire\nExpert: Arrow keys + SPACE fire", subStyle)
            .setOrigin(0.5)
            .setLineSpacing(6)

        this.add.text(320, 420, "Tip: Blue ship grants Rapid Fire!", hintStyle).setOrigin(0.5)

        // button styles
        const cardStyle = {
            fontFamily: 'Courier',
            fontSize: '20px',
            color: '#000000',
            align: 'center'
        }

        const cardSub = {
            fontFamily: 'Courier',
            fontSize: '14px',
            color: '#1a1a1a',
            align: 'center'
        }

        // cards (clickable)
        this.noviceCard = this.makeCard(180, 320, 250, 80, 0x40ff7a, "NOVICE", "Mouse controls\n60 seconds", () => {
            this.startMode("mouse", 3, 60000)
        }, cardStyle, cardSub)

        this.expertCard = this.makeCard(460, 320, 250, 80, 0xffb84d, "EXPERT", "Keyboard controls\n45 seconds", () => {
            this.startMode("keyboard", 4, 45000)
        }, cardStyle, cardSub)

        // keyboard selection (keeps your assignment behavior)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        // tiny hint for keyboard
        this.add.text(320, 380, "Press ← for Novice  |  Press → for Expert", subStyle).setOrigin(0.5)
    }

    makeCard(x, y, w, h, color, title, subtitle, onClick, titleStyle, subStyle) {
        const container = this.add.container(x, y)

        const bg = this.add.rectangle(0, 0, w, h, color, 1).setOrigin(0.5)
        bg.setStrokeStyle(3, 0xffffff, 0.9)

        const t = this.add.text(0, -14, title, titleStyle).setOrigin(0.5)
        const s = this.add.text(0, 16, subtitle, subStyle).setOrigin(0.5).setLineSpacing(4)

        container.add([bg, t, s])

        // make interactive
        bg.setInteractive({ useHandCursor: true })
        bg.on('pointerover', () => {
            bg.setScale(1.03)
            bg.setStrokeStyle(3, 0x00ffff, 1)
        })
        bg.on('pointerout', () => {
            bg.setScale(1.0)
            bg.setStrokeStyle(3, 0xffffff, 0.9)
        })
        bg.on('pointerdown', onClick)

        return container
    }

    startMode(inputMode, spaceshipSpeed, gameTimer) {
        game.settings = { spaceshipSpeed, gameTimer, inputMode }
        this.sound.play('sfx-select')
        this.scene.start('PlayScene')
    }

    update() {
        // animate background
        this.bg.tilePositionX -= 1.2
        this.bg.tilePositionY -= 0.4

        // décor ships drifting
        this.decorShip1.x -= 1.8
        this.decorShip2.x -= 2.5
        if (this.decorShip1.x < -100) this.decorShip1.x = 740
        if (this.decorShip2.x < -100) this.decorShip2.x = 820

        // keyboard shortcuts
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.startMode("mouse", 3, 60000)
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.startMode("keyboard", 4, 45000)
        }
    }
}
