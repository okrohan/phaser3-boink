import { AbstractScene } from "./abstractGameScene";
import { ASSETS_NAMES, ASSET_SCALE_MAPPING } from "../constants";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'GameEditorScene',
};

const initLevelLayout = {
    height: 600,
    width: 1024,
    playerStart: {
        x: 200,
        y: 200,
        key: ASSETS_NAMES.PLAYER
    },
    finish: {
        x: 600,
        y: 200,
        key: ASSETS_NAMES.FLAG
    },
}

const allowedSprites = [ASSETS_NAMES.GROUND.TINY, ASSETS_NAMES.GROUND.SMALL, ASSETS_NAMES.GROUND.MEDIUM, ASSETS_NAMES.GROUND.LARGE, ASSETS_NAMES.GROUND.OOH_BOI,ASSETS_NAMES.SHIBA, ASSETS_NAMES.SPIKE, ASSETS_NAMES.STAR ]
const restrictedSprites = [ASSETS_NAMES.PLAYER, ASSETS_NAMES.FLAG]
const SCROLL_FACTOR = 50

export class GameEditorScene extends AbstractScene {
    editorState: any;
    selectionText: Phaser.GameObjects.Text;
    sprites: Phaser.GameObjects.Sprite[];
    

    constructor(){
        super(sceneConfig)
        this.levelLayout = { ...initLevelLayout}
        this.editorState = {
            activeOption: 0,
            activeCursor: Phaser.GameObjects.Sprite
        }
        this.sprites = []
    }

    refreshAlphas(){
        this.sprites.forEach((sprite) => {
            if (sprite === this.editorState.activeCursor)
            sprite.setAlpha(1)
            else
            sprite.setAlpha(0.5)
        })
    }

    updateOptionSelection(index:number){
        allowedSprites[this.editorState.activeOption + index] && (this.editorState.activeOption += index)
        this.selectionText.setText(`Click to Add: ${allowedSprites[this.editorState.activeOption]}`).setFontSize(16)
    }

    updateSpriteSelection(sprite: Phaser.GameObjects.Sprite){
        if (sprite === this.editorState.activeCursor){
            this.editorState.activeCursor = null    
            this.cameras.main.stopFollow()
        }
        else {
            this.editorState.activeCursor = sprite
            sprite &&  this.cameras.main.startFollow(sprite,false,1,1,200,200)   
        }
            
        this.refreshAlphas()
    }

    createSprite({x,y,key},force = false){
        if(restrictedSprites.includes(key) && !force)
        return
        const sprite = this.add.sprite(x, y, key).setScale(ASSET_SCALE_MAPPING[key] || 1).setInteractive()
        sprite.on('pointerdown', () => this.updateSpriteSelection(sprite))
        this.sprites.push(sprite)
        return sprite
    }

    handleAddNewSprite =() => {
        const sprite = this.createSprite({ x: this.input.mousePointer.worldX, y: this.input.mousePointer.worldY, key:allowedSprites[this.editorState.activeOption]})
        this.updateSpriteSelection(sprite)
    }

    create(){
        super.create()
        this.selectionText = this.add.text(window.innerWidth/2 - 150, 555,'').setDepth(1000).setScrollFactor(0).setInteractive().on('pointerdown', this.handleAddNewSprite).setBackgroundColor('black')
        this.add.text(window.innerWidth / 2 - 170, 555, '<').setDepth(1500).setScrollFactor(0).setInteractive().on('pointerdown', () => this.updateOptionSelection(-1)).setBackgroundColor('black')
        this.add.text(window.innerWidth / 2 + 120, 555, '>').setDepth(1500).setScrollFactor(0).setInteractive().on('pointerdown', () => this.updateOptionSelection(+1)).setBackgroundColor('black')
        this.updateOptionSelection(0)
        this.createSprite(this.levelLayout.playerStart, true)
        this.createSprite(this.levelLayout.finish, true)
        this.updateSpriteSelection(null)
        this.input.mouse.enabled = true
    }

    update(){
        this.editorState.activeCursor && this.editorState.activeCursor.setX(this.input.mousePointer.worldX).setY(this.input.mousePointer.worldY)
        if (this.editorState.activeCursor && this.physics.world.bounds.width < this.input.mousePointer.worldX + 10) {
            console.log('expanding')
            this.physics.world.setBounds(0, 0, this.physics.world.bounds.width + 100, this.physics.world.bounds.height)
            this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width + 100, this.physics.world.bounds.height);
        }
        
    }
}