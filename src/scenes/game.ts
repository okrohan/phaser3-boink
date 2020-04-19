import level from './levels/level1';
import { ASSETS_NAMES, ASSET_WIDTH_MAPPING } from '../constants';
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};


export class GameScene extends Phaser.Scene {
    private player: Phaser.Physics.Arcade.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private platforms: any
    private isOnGround: number;

    constructor() {
        super(sceneConfig);
    }

    public preload() {
        this.load.image('player', 'assets/ball.png', )
        Object.values(ASSETS_NAMES.GROUND).forEach((key: string) => {
            this.load.spritesheet(key, 'assets/ground_block.png', { frameWidth: ASSET_WIDTH_MAPPING.GROUND[key] })
        })        
    }

    private handleWorldCollision = () => {        
        if(this.player.body.blocked.down){
            alert('LOSER!')
            this.scene.start()
        }
    }

    private createPlayer(){
        this.player = this.physics.add.sprite(level.playerStart.x, level.playerStart.y, 'player', null).setScale(0.2, 0.2)
        this.player.setCollideWorldBounds(true)
        
        this.player.setBounce(1, 0.4)
        this.player.setMaxVelocity(250)
        this.physics.add.collider(this.player, this.platforms, this.handleGroundCollide);
        // @ts-ignore
        this.player.body.onWorldBounds = true
        this.physics.world.on('worldbounds', this.handleWorldCollision)

    }

    private createLevel(){
        var platforms = this.physics.add.staticGroup();
        level.sprites.forEach((item) => {
            const { x, y, key, scale } = item;
            platforms.create(x, y, key).setScale(scale || 0.2 ).refreshBody()
        })
        this.platforms = platforms
    }

    public create() {
        this.cameras.main.setBounds(0, 0, level.width, level.height);
        this.physics.world.setBounds(0, 0, level.width, level.height );
        this.cursors = this.input.keyboard.createCursorKeys()
        this.createLevel()
        this.createPlayer()
        this.cameras.main.startFollow(this.player, true, 1, 1); 
        alert(`
        Hii I am Ballsy. 
        My world was taken by evil people that took all our Good Stuff away.
        No am on a mission to recollect them and Kill evil people. 
        Why you ask? Cuz I'm pretty BALLSY!
        
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
            this.player.setVelocityY(-200)
            this.isOnGround = 1
        }
        if (cursors.up.isDown && this.isOnGround < 2 && this.player.body.velocity.y > 0) {
            this.player.setVelocityY(-200)
            this.isOnGround = 2
        }
        if (cursors.left.isDown){
            this.player.setAccelerationX(-500)
            this.player.setAngularVelocity(-500)
        }
        else if (cursors.right.isDown){
            this.player.setAccelerationX(500)
            this.player.setAngularVelocity(500)
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