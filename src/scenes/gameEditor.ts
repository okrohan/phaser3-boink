import { AbstractScene } from "./abstractGameScene";

import { ASSETS_NAMES, ASSET_SCALE_MAPPING, ASSET_WIDTH_MAPPING } from "../constants";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'GameEditorScene',
};

const initLevelLayout = {
    height: 600,
    width: window.innerWidth,
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

const tileSprite = [ASSETS_NAMES.GROUND.MEDIUM, ASSETS_NAMES.GROUND.LARGE, ASSETS_NAMES.GROUND.HUGE]
const platforms = [ASSETS_NAMES.GROUND.TINY, ASSETS_NAMES.GROUND.SMALL]
const enemies = [ASSETS_NAMES.SHIBA, ASSETS_NAMES.SPIKE]
const collectables = [ASSETS_NAMES.STAR]
const allowedSprites = [ASSETS_NAMES.GROUND.TINY, ASSETS_NAMES.GROUND.SMALL, ...tileSprite, ASSETS_NAMES.SHIBA, ASSETS_NAMES.SPIKE, ASSETS_NAMES.STAR]

const restrictedSprites = [ASSETS_NAMES.PLAYER, ASSETS_NAMES.FLAG]

export class GameEditorScene extends AbstractScene {
    editorState: any;
    selectionText: Phaser.GameObjects.Text;
    sprites: (Phaser.GameObjects.Sprite | Phaser.GameObjects.TileSprite)[];
    controls: Phaser.Cameras.Controls.SmoothedKeyControl;
    openedWindow: Window;
    

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

    updateSpriteSelection(sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.TileSprite){
        if (sprite === this.editorState.activeCursor){
            this.editorState.activeCursor = null    
        }
        else {
            this.editorState.activeCursor = sprite
        }            
        this.refreshAlphas()
    }

    removeSelected = () => {
        if (this.editorState.activeCursor && !restrictedSprites.includes((this.editorState.activeCursor.data.get('key')))){
            this.editorState.activeCursor.destroy()
            this.editorState.activeCursor = null
            this.refreshAlphas()
        } else {
            console.log('Moo')
            this.handleAddNewSprite()
        }
    }

    generateSprite({ x, y, key }: any) {
        if(tileSprite.includes(key)){
            return this.add.tileSprite(x, y, ASSET_WIDTH_MAPPING.GROUND[key], 150, key).setInteractive()
        } else {
            return this.add.sprite(x, y, key).setScale(ASSET_SCALE_MAPPING[key] || 1).setInteractive()
        }
    }

    createSprite({x,y,key},force = false){
        if(restrictedSprites.includes(key) && !force)
        return
        const sprite = this.generateSprite({ x, y, key })
        sprite.setDataEnabled()
        console.log(sprite, key)
        sprite.data.set('key', key)
        sprite.on('pointerdown', () => this.updateSpriteSelection(sprite))
        this.sprites.push(sprite)
        return sprite
    }

    handleAddNewSprite =() => {
        const sprite = this.createSprite({ x: this.input.mousePointer.worldX, y: this.input.mousePointer.worldY, key:allowedSprites[this.editorState.activeOption]})
        this.updateSpriteSelection(sprite)
    }

    generateLayout = () => {
        const value = this.sprites.reduce((acc, curr) => {
            if (!curr.data)
            return acc
            acc.width = Math.max(curr.x + curr.width , acc.width, window.innerWidth)
            acc.height = Math.max(curr.y + curr.height, acc.height, 600)
            const key = curr.data.get('key')
            console.log(curr.x, curr.y, curr.width, curr.height, curr, key)
            const spriteLayout = {
                x: curr.x,
                y: curr.y,
                key 
            }
            if (key === ASSETS_NAMES.PLAYER){
                acc.playerStart = spriteLayout
            } else if(key  === ASSETS_NAMES.FLAG){
                acc.finish = spriteLayout
            } else if (enemies.includes(key)) {
                acc.enemies.push(spriteLayout)
            } else if (collectables.includes(key)) {
                acc.collectables.push(spriteLayout)
            } else if (platforms.includes(key)) {
                acc.platforms.push(spriteLayout)
            } else if (tileSprite.includes(key)) {
                acc.tiles.push({ ...spriteLayout, width: ASSET_WIDTH_MAPPING.GROUND[key]})
            }
            return acc
        }, {...initLevelLayout, platforms: [], tiles: [], enemies: [], collectables: [], time: 0}  )
        console.log('\n\n\n====',JSON.stringify(value, null, 2))
        try{
            value.time = parseInt(prompt('Level time (in seconds)?'))
        }
        catch(e){
            value.time = 120
        }
    
        return value
    }

    generateAndDownload = () => {
        const val = this.generateLayout()
        const text = '// Generated \n export default ' + JSON.stringify(val, null, 2)
        const fileName = 'level'
        const fileType = 'ts'
        var blob = new Blob([text], { type: 'ts' });
        var a = document.createElement('a');
        a.download = fileName;
        a.href = URL.createObjectURL(blob);
        a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
    }

    generateAndPlay = () => {
        this.openedWindow && this.openedWindow.close()
        const layout = this.generateLayout()
        this.openedWindow = window.open(location.href.split('?')[0])
        console.log('opened')
        //@ts-ignore
        this.openedWindow && (this.openedWindow.level = JSON.stringify(layout))
        console.log('done')
    }

    create(){
        super.create()
        this.cameras.main.setBounds(0, 0, this.levelLayout.width * 20, this.levelLayout.height *20);
        this.selectionText = this.add.text(window.innerWidth/2 - 150, 555,'').setDepth(1000).setScrollFactor(0).setInteractive().on('pointerdown', this.handleAddNewSprite).setBackgroundColor('black')
        this.add.text(window.innerWidth / 2 - 170, 555, '<').setDepth(1500).setScrollFactor(0).setInteractive().on('pointerdown', () => this.updateOptionSelection(-1)).setBackgroundColor('black')
        this.add.text(window.innerWidth / 2 + 120, 555, '>').setDepth(1500).setScrollFactor(0).setInteractive().on('pointerdown', () => this.updateOptionSelection(+1)).setBackgroundColor('black')
        this.add.text(window.innerWidth - 100, 50, 'Download').setDepth(1500).setScrollFactor(0).setInteractive().on('pointerdown', this.generateAndDownload).setBackgroundColor('black')
        this.add.text(window.innerWidth - 200, 50, 'Play').setDepth(1500).setScrollFactor(0).setInteractive().on('pointerdown', this.generateAndPlay).setBackgroundColor('black')
        this.add.text(50, 50, 'Controls:\n-Arrow to move camera \n-Space to add/remove selected item').setDepth(1500).setScrollFactor(0)
        this.cursors.space.addListener('up', this.removeSelected)
        this.updateOptionSelection(0)
        this.createSprite(this.levelLayout.playerStart, true)
        this.createSprite(this.levelLayout.finish, true)
        this.updateSpriteSelection(null)
        this.input.mouse.enabled = true
        var controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    }

    positiveOrZero = (val: number ) => val > 0 ? val : 0

    update(_time, delta){
        this.editorState.activeCursor && this.editorState.activeCursor.setX(this.input.mousePointer.worldX).setY(this.input.mousePointer.worldY)
        this.controls.update(delta)
    }
}