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
            activeCursor: 0
        }
        this.sprites = []
        console.log(allowedSprites)
    }

    refreshAlphas(){
        const activeIndex = this.editorState.activeCursor
        this.sprites.forEach((sprite, index) => {
            if(index === activeIndex)
            sprite.setAlpha(1)
            else
            sprite.setAlpha(0.5)
        })
    }

    updateOptionSelection(index:number){
        this.editorState.activeOption = index
        this.selectionText.setText(`${allowedSprites[this.editorState.activeOption]}`).setFontSize(24)
    }

    updateSpriteSelection(index: number){
        console.log(index)
        this.editorState.activeCursor = index
        this.refreshAlphas()
    }

    createSprite({x,y,key},force = false){
        if(restrictedSprites.includes(key) && !force)
        return
        console.log('creatin sprite')
        this.sprites.push(this.add.sprite(x,y,key).setScale(ASSET_SCALE_MAPPING[key] || 1))
        this.updateSpriteSelection(this.sprites.length -1)
    }

    handleRightKey =() =>{
        if(this.cursors.shift.isDown){
            let updated = this.editorState.activeCursor + 1
            updated = updated > this.sprites.length - 1 ? 0 : updated
            this.updateSpriteSelection(updated)
        }else {
            const currentSprite = this.sprites[this.editorState.activeCursor]
            currentSprite.setX(currentSprite.x + SCROLL_FACTOR)
        }
    }

    handleLeftKey =() => {
        if (this.cursors.shift.isDown) {
            let updated = this.editorState.activeCursor - 1
            updated = updated < 0 ? this.sprites.length - 1 : updated
            this.updateSpriteSelection(updated)
        } else {
            const currentSprite = this.sprites[this.editorState.activeCursor]
            currentSprite.setX(currentSprite.x - SCROLL_FACTOR)
        }
    }

    handleUpKey = () => {
        if (this.cursors.shift.isDown) {
            let updated = this.editorState.activeOption - 1
            updated = updated < 0 ? allowedSprites.length - 1 : updated
            this.updateOptionSelection(updated)
        } else {
            const currentSprite = this.sprites[this.editorState.activeCursor]
            currentSprite.setY(currentSprite.y - SCROLL_FACTOR)
        }
    }

    handleDownKey = () => {
        if (this.cursors.shift.isDown) {
            let updated = this.editorState.activeOption + 1
            updated = updated > allowedSprites.length - 1 ? 0 : updated
            this.updateOptionSelection(updated)
        } else {
            const currentSprite = this.sprites[this.editorState.activeCursor]
            currentSprite.setY(currentSprite.y + SCROLL_FACTOR)
        }
    }

    handleSpace = () => {
        const currentSprite = this.sprites[this.editorState.activeCursor]
        this.createSprite({ x: currentSprite.x, y: currentSprite.y,key: allowedSprites[this.editorState.activeOption] })
        
    }

    create(){
        super.create()
        this.selectionText = this.add.text(window.innerWidth/2, 550,'').setDepth(1000).setScrollFactor(0)
        this.add.text(20, 20, 'Controls:  \n[Shift?] + [Arrow Keys] to move around\n[Space] to add items').setDepth(1000).setScrollFactor(0)
        this.updateOptionSelection(0)
        this.createSprite(this.levelLayout.playerStart, true)
        this.createSprite(this.levelLayout.finish, true)
        
        this.updateSpriteSelection(0)
        this.cursors.left.addListener('up', this.handleLeftKey)
        this.cursors.right.addListener('up', this.handleRightKey)
        this.cursors.up.addListener('up', this.handleUpKey)
        this.cursors.down.addListener('up', this.handleDownKey)
        this.cursors.space.addListener('up', this.handleSpace)
    }

    update(){
        const cursor = this.cursors
        if (cursor.left.isDown){
            
        } else if (cursor.right.isDown){
            
        }
    }
    
}