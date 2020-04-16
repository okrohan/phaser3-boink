import {Types, Scene,Physics } from 'phaser'
const sceneConfig: Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

const debounce = (callback, wait) => {
    let timeout = null
    return (...args) => {
        const next = () => callback(...args)
        clearTimeout(timeout)
        timeout = setTimeout(next, wait)
    }
}


export class GameScene extends Scene {
    private player: Physics.Arcade.Sprite;
    private cursors: Types.Input.Keyboard.CursorKeys;
    private isOnGround: number;
    constructor() {
        super(sceneConfig);
    }


    public preload() {
        this.load.image('player', 'assets/ball.png', )
        this.load.image('ground', 'assets/ground_block.png', )
    }

    private handleGroundCollide = () => {
        this.isOnGround = 0
    }

    public create() {
        this.player = this.physics.add.sprite(50,50, 'player', null).setScale(0.2, 0.2)
        this.player.setCollideWorldBounds(true)
        var platforms = this.physics.add.staticGroup();
        // platforms.createFromConfig()
        platforms.create(400, 568, 'ground').setScale(0.2).refreshBody();
        platforms.create(600, 400, 'ground').setScale(0.2).refreshBody();
        platforms.create(50, 250, 'ground').setScale(0.2).refreshBody();
        platforms.create(750, 220, 'ground').setScale(0.2).refreshBody();
        this.player.setBounce(1,0.4)
        this.physics.add.collider(this.player, platforms, this.handleGroundCollide);
        this.cursors = this.input.keyboard.createCursorKeys()

    }
    public update() {
        const cursors = this.cursors
        this.isOnGround && console.log(this.player.body.velocity)
        if(cursors.up.isDown && !this.isOnGround)
        {
            this.player.setVelocityY(-200)
            this.isOnGround = 1
            console.log('JUMP')
        }
        if(cursors.up.isDown && this.isOnGround < 2 && this.player.body.velocity.y > 0)
        {
            console.log('JUMP2')
            this.player.setVelocityY(-200)
            this.isOnGround = 2
        }
        if(cursors.left.isDown)
            this.player.setVelocityX(-200)
        else if(cursors.right.isDown)
            this.player.setVelocityX(200)
        else
            this.player.setVelocityX(0)



    }

}