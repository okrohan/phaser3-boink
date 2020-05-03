import { ASSETS_NAMES, ASSET_WIDTH_MAPPING } from "../constants";


export class AbstractScene extends Phaser.Scene {
    public levelLayout: any
    public cursors: Phaser.Types.Input.Keyboard.CursorKeys;


    public preload() {
        const progress = this.add.graphics();
        const progressText = this.add.text(window.innerWidth / 2, 290, '').setFontSize(32).setFill('white')
        this.load.on('progress', function (value) {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, 270, window.innerWidth * value, 60);
            if (value > 0.5) {
                progressText.setFill('black')
            }
            // @ts-ignore
            progressText.setText(parseInt(value * 100) + "%")
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
    }

    public create() {
        const levelLayout = this.levelLayout
        this.cameras.main.setBounds(0, 0, levelLayout.width, levelLayout.height);
        this.physics.world.setBounds(0, 0, levelLayout.width, levelLayout.height);
        this.cursors = this.input.keyboard.createCursorKeys()
    }

}