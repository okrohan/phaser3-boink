import { ASSETS_NAMES, ASSET_WIDTH_MAPPING, PLAYER, ASSET_SCALE_MAPPING } from '../constants';
import { getLevel } from './levels';


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'GameScene',
};


export class GameScene extends Phaser.Scene {
    private levelLayout: any
    private player: Phaser.Physics.Arcade.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private platforms: any
    private gameState: any
    collectables: any;
    enemies: any;
    finish: Phaser.Physics.Arcade.Sprite;

    constructor() {
        super(sceneConfig);
        this.initGameState()
    }

    private initGameState(){
        this.gameState = {
            gameStarted: false,
            playerOnGround: 0,
            totalScore: 0,
            currentScore: 0,
            currentLives: 0,
            timeText: null,
            livesText: null,
        }
    }

    public preload() {
        const progress = this.add.graphics();
        const progressText = this.add.text(window.innerWidth/2,290, '').setFontSize(32).setFill('white')

        this.load.on('progress', function (value) {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, 270, window.innerWidth * value, 60);
            if(value > 0.5){
                progressText.setFill('black')
            }
            // @ts-ignore
            progressText.setText(parseInt(value*100)+ "%")
        });

        this.load.on('complete', function () {
            progress.destroy();
            progressText.destroy()
        });
        
        Object.keys(ASSETS_NAMES).forEach((item) => 
            this.load.image(item.toLowerCase(), `assets/${item.toLowerCase()}.png`)
        )
        Object.values(ASSETS_NAMES.GROUND).forEach((key: string) => {
            ASSET_WIDTH_MAPPING.GROUND[key] && this.load.spritesheet(key, `assets/${ASSETS_NAMES.GROUND.GROUND}.png`, { frameWidth: ASSET_WIDTH_MAPPING.GROUND[key] })
        })
        this.load.audio('background_music', 'assets/background_music.mp3')
        this.load.audio('jump_music', 'assets/jump.wav')
        this.load.audio('coin_music', 'assets/coin.mp3')
    }

    private handleWorldCollision = () => {        
        if(this.player.body.blocked.down){
            this.handleDeath()
        }
    }

    private handleWin = () => {
        if (!this.gameState.gameStarted)
            return
        if(this.gameState.currentScore === this.collectables.length){
            this.handleDeath()
        }
        
    }
    
    private handleDeath = () => {
        if (!this.gameState.gameStarted)
            return
        this.gameState = {}
        this.cameras.main.flash(500)
        this.cameras.main.shake(500, 0.05, true, (_cam, prog) => {
            this.initGameState()
            this.sound.stopAll()
            prog === 1 && this.scene.restart()
        })
    }

    private handleCollect = (_player, collectable) => {
        if (!this.gameState.gameStarted)
            return
        this.gameState.currentScore+=1
        this.gameState.totalScore += 100
        this.gameState.scoreText.setText(this.getScoreText())
        this.sound.play('coin_music', { volume: 0.2})
        collectable.destroy()
    }

    private createPlayer(){
        this.player = this.physics.add.sprite(this.levelLayout.playerStart.x, this.levelLayout.playerStart.y, ASSETS_NAMES.PLAYER, null).setScale(ASSET_SCALE_MAPPING[ASSETS_NAMES.PLAYER])
        this.player.setCollideWorldBounds(true)
        this.player.setBounce(1, 0.4)
        this.player.setMaxVelocity(250)
    }

    private createLevel(){
        // Platforms
        const platforms = this.physics.add.staticGroup();
        const clouds = this.physics.add.staticGroup();

        for (var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(400, this.levelLayout.width);
            var y = Phaser.Math.RND.between(50, 400);
            clouds.create(x, y, ASSETS_NAMES.CLOUD).setScale(ASSET_SCALE_MAPPING[ASSETS_NAMES.CLOUD])
        }
        clouds.setAlpha(0.3).setDepth(0).setBlendMode(0)

        this.levelLayout.platforms.forEach((item) => {
            const { x, y, key } = item;
            platforms.create(x, y, key).setScale(ASSET_SCALE_MAPPING[key] || 1).refreshBody()
        })

        this.levelLayout.tiles.forEach(({x, width, y, height = 150}) => 
            platforms.add(this.add.tileSprite(x, y, width, height, ASSETS_NAMES.GROUND.GROUND))
        )
        
        this.collectables = this.levelLayout.collectables.map(({key, x, y}) =>  
            this.physics.add.sprite(x, y, key).setScale(ASSET_SCALE_MAPPING[key] || 1).setCollideWorldBounds(true)
            )
        
        this.enemies = this.levelLayout.enemies.map(({ key, x, y }) =>
            this.physics.add.sprite(x, y, key).setScale(ASSET_SCALE_MAPPING[key] || 1)
        )
        const {finish} = this.levelLayout
        this.finish = this.physics.add.sprite(finish.x, finish.y, ASSETS_NAMES.FLAG).setScale(ASSET_SCALE_MAPPING[ASSETS_NAMES.FLAG] || 1)
        this.platforms = platforms
        
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.collectables, this.platforms);
        this.physics.add.collider(this.enemies, this.collectables);
        this.physics.add.collider(this.finish, this.platforms);
        this.physics.add.collider(clouds, clouds, (c1) => 
            c1.destroy()
         )
    }35
    
    private initPlayerInteractors(){
        // Text
        const texts = [
        this.add.text(50, 50, 'BOiNK!', { fontSize: 72, fontStyle: 'bold', stroke: 'black', strokeThickness: 5, fill: 'white' }),
        this.add.text(50, 130, 'Controls: ⬅[Left]  ➡[Right]  ⬆[Up]  ⬇[Down]', { fontSize: 24, fontStyle: 'bold', stroke: 'black', strokeThickness: 2, fill: 'white' }),
        this.add.text(50, 160, 'Press \'Space\' to Start ', { fontSize: 24, fontStyle: 'bold', stroke: 'black', strokeThickness: 2, fill: 'white' })
        ]
        // Collisions
        // @ts-ignore
        this.player.body.onWorldBounds = true
        this.physics.world.on('worldbounds', this.handleWorldCollision)
        this.physics.add.collider(this.player, this.platforms, this.handleGroundCollide);
        this.physics.add.collider(this.player, this.enemies, this.handleDeath);
        this.physics.add.overlap(this.player, this.finish, this.handleWin);
        this.physics.add.overlap(this.player, this.collectables,this.handleCollect)
        // Camera
        this.cameras.main.startFollow(this.player, true, 1, 1);
        // Cursors
        
        this.cursors.space.addListener('up',() => {
            console.log('starting game')
            this.gameState.gameStarted = new Date()
            texts.forEach((text) => text.destroy())
            this.gameState.timeText = this.add.text(window.innerWidth - 100, 50, this.getTimeText(), { fontSize: 20, fontStyle: 'bold', stroke: 'black', strokeThickness: 2, fill: 'white' }).setScrollFactor(0)
            
            this.sound.play('background_music', {loop: true, volume: 0.5})
            this.cursors.space.removeListener('up')
        })
    }

    public create() {
        const { level, lives, score } = getLevel()
        this.levelLayout = level
        this.gameState.currentScore = 0
        this.gameState.totalScore = score
        this.gameState.currentLives = lives
        this.gameState.scoreText = this.add.text(20, 20, this.getScoreText(), { fontSize: 20, fontStyle: 'bold', stroke: 'black', strokeThickness: 2, fill: 'white' }).setScrollFactor(0)
        this.gameState.livesText = this.add.text(window.innerWidth - 100, 20, this.getLivesText(), { fontSize: 20, fontStyle: 'bold', stroke: 'black', strokeThickness: 2, fill: 'white' }).setScrollFactor(0)
        this.cameras.main.setBounds(0, 0, this.levelLayout.width, this.scale.height);
        this.physics.world.setBounds(0, 0, this.levelLayout.width, this.scale.height );
        this.cursors = this.input.keyboard.createCursorKeys()
        this.createLevel()
        this.createPlayer()
        this.initPlayerInteractors()   
    }


    private handleGroundCollide = (arg1,arg2) => {
        // Allow ledge jump        
        if ((arg2.body.y + arg2.body.height) > (arg1.body.y))
        this.gameState.playerOnGround = 0
        
    }
    
    private getTimeText() {
        //@ts-ignore
        const diff = this.levelLayout.time - (new Date(new Date() - this.gameState.gameStarted).getSeconds())
        //@ts-ignore
        return `${parseInt(diff / 60)}:${diff%60}`
    }

    private getScoreText() {
        return `Score : ${this.gameState.totalScore || 0}`
    }

    private getLivesText(){
        return `❤ ${this.gameState.currentLives}`
    }


    private handleMovement() {
        const cursors = this.cursors
        // TODO: Simplify
        
        if (cursors.up.isDown && !this.gameState.playerOnGround) {            
            this.player.setVelocityY(PLAYER.VELOCITY_Y)
            this.gameState.playerOnGround = 1
            this.sound.play('jump_music', { volume: 0.05 })
        }
        if (cursors.up.isDown && this.gameState.playerOnGround < 2 && this.player.body.velocity.y > 0) {
            this.player.setVelocityY(PLAYER.VELOCITY_Y)
            this.gameState.playerOnGround = 2
            this.sound.play('jump_music', { volume: 0.05 })
        }
        if (cursors.left.isDown){
            this.player.setAccelerationX(-PLAYER.ACCELERATION)
            this.player.setAngularVelocity(-PLAYER.ANGULAR_ACC)
        }
        else if (cursors.right.isDown){
            this.player.setAccelerationX(PLAYER.ACCELERATION)
            this.player.setAngularVelocity(PLAYER.ANGULAR_ACC)
        }   
        else if (!this.gameState.playerOnGround){
                this.player.setVelocityX(0)
                this.player.setAccelerationX(0)
                this.player.setAngularVelocity(0)
        }
        else {
            this.player.setAccelerationX(0)
        }
            
    }

    public update() {
        if(this.gameState.gameStarted) {
        this.handleMovement()
        this.gameState.timeText.setText(this.getTimeText())
        }
    }

}