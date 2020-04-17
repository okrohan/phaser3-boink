const MAX_VELOCITY = 250
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
        this.load.image('ground', 'assets/ground_block.png', )
    }
    
    private createPlayer(){
        this.player = this.physics.add.sprite(50, 50, 'player', null).setScale(0.2, 0.2)
        this.player.setCollideWorldBounds(true)
        this.player.setBounce(1, 0.4)
        this.player.setMaxVelocity(250)
        this.physics.add.collider(this.player, this.platforms, this.handleGroundCollide);
    }

    private createLevel(){
        var platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(0.2).refreshBody();
        platforms.create(600, 400, 'ground').setScale(0.2).refreshBody();
        platforms.create(50, 250, 'ground').setScale(0.2).refreshBody();
        platforms.create(750, 220, 'ground').setScale(0.2).refreshBody();
        this.platforms = platforms

    }

    public create() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.createLevel()
        this.createPlayer()
    }


    private handleGroundCollide = () => {
        this.isOnGround = 0
    }

    private handleMovement() {

        const cursors = this.cursors
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
        else {
            this.player.setVelocityX(0)
            this.player.setAccelerationX(0)
            this.player.setAngularVelocity(0)
        }
            
    }

    public update() {
        this.handleMovement()
    }

}