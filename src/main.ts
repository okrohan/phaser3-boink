import  * as Phaser from 'phaser'
import {GameScene} from "./scenes/game";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',
  type: Phaser.AUTO,
  scene:GameScene,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {y: 300}
    },
  },
  parent: 'game',
  backgroundColor: '#5ad7ff',
};
 
export const game = new Phaser.Game(gameConfig);
