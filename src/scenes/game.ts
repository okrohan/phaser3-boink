import { ASSETS_NAMES, ASSET_WIDTH_MAPPING, PLAYER } from '../constants';
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
    private isOnGround: number;

    constructor() {
        super(sceneConfig);
    }

    public preload() {
        this.levelLayout = getLevel()
        this.load.image('player', 'assets/ball.png', )
        this.load.image('ground_block_raw', 'assets/ground_block.png')
        this.load.image('spike_monster_1', 'assets/spike_monster_1.png')
        this.load.image('spike_monster_2', 'assets/spike_monster_2.png')
        this.load.image('spike', 'assets/spike.png')
        this.load.image('spiket', 'assets/test_spike.png')
        this.load.image('dog', 'assets/dog.png')
        this.load.image('star', 'assets/star.png')
        Object.values(ASSETS_NAMES.GROUND).forEach((key: string) => {
            this.load.spritesheet(key, 'assets/ground_block.png', { frameWidth: ASSET_WIDTH_MAPPING.GROUND[key] })
        })
    }

    private handleWorldCollision = () => {        
        if(this.player.body.blocked.down){
            this.scene.restart()
        }
    }

    private createPlayer(){
        this.player = this.physics.add.sprite(this.levelLayout.playerStart.x, this.levelLayout.playerStart.y, 'player', null).setScale(0.25)
        this.player.setCollideWorldBounds(true)

        this.player.setBounce(1, 0.4)
        this.player.setMaxVelocity(250)
        const tileSprite = this.add.tileSprite(50, 600 - 50, this.levelLayout.width, 150, 'ground_block_raw')
        this.physics.add.existing(tileSprite, true)
        this.physics.add.collider(this.player, tileSprite, this.handleGroundCollide);
        this.physics.add.collider(this.player, this.platforms, this.handleGroundCollide);
        
        // @ts-ignore
        this.player.body.onWorldBounds = true
        this.physics.world.on('worldbounds', this.handleWorldCollision)
        this.add.sprite(300, 450, 'star', null).setScale(0.16)
        this.add.sprite(500, 450, 'dog', null).setScale(0.6)
        this.add.sprite(700, 450, 'dog', null).setScale(0.6)
        this.add.sprite(750, 450, 'spike', null).setScale(0.2)
        this.add.sprite(800, 450, 'star', null).setScale(0.15)

    }

    private createLevel(){
        var platforms = this.physics.add.staticGroup();
        this.levelLayout.sprites.forEach((item) => {
            const { x, y, key, scale } = item;
            platforms.create(x, y, key).setScale(scale || 0.2 ).refreshBody()
        })
        this.platforms = platforms
    }

    public create() {
        console.log(this.scale.height)
        this.cameras.main.setBounds(0, 0, this.levelLayout.width, this.scale.height);
        this.physics.world.setBounds(0, 0, this.levelLayout.width, this.scale.height );

        this.cursors = this.input.keyboard.createCursorKeys()
        this.createLevel()
        this.createPlayer()
        this.cameras.main.startFollow(this.player, true, 1, 1); 
        alert(`
        GAME IS STILL IN DEVELOPMENT \n
        Controls: UP/DOWN/LEFT/RIGHT Arrows
        `)       

    }


    private handleGroundCollide = () => {
        this.isOnGround = 0
    }

    private handleMovement() {
        const cursors = this.cursors
        // TODO: Simplify
        
        if (cursors.up.isDown && !this.isOnGround) {            
            this.player.setVelocityY(PLAYER.VELOCITY_Y)
            this.isOnGround = 1
        }
        if (cursors.up.isDown && this.isOnGround < 2 && this.player.body.velocity.y > 0) {
            this.player.setVelocityY(PLAYER.VELOCITY_Y)
            this.isOnGround = 2
        }
        if (cursors.left.isDown){
            this.player.setAccelerationX(-PLAYER.ACCELERATION)
            this.player.setAngularVelocity(-PLAYER.ANGULAR_ACC)
        }
        else if (cursors.right.isDown){
            this.player.setAccelerationX(PLAYER.ACCELERATION)
            this.player.setAngularVelocity(PLAYER.ANGULAR_ACC)
        }   
        else if (!this.isOnGround){
                this.player.setVelocityX(0)
                this.player.setAccelerationX(0)
                this.player.setAngularVelocity(0)
        }
        else {
            this.player.setAccelerationX(0)
        }
            
    }

    public update() {
        this.handleMovement()
    }

}