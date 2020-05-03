import  * as Phaser from 'phaser'
import {GameScene} from "./scenes/game";
import { GameEditorScene } from './scenes/gameEditor';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',
  type: Phaser.AUTO,
  scene: location.href.includes('editor')? GameEditorScene : GameScene,

  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'content',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: 600,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: location.href.includes('debug'),
      gravity: {y: 300}
    },
  },
  parent: 'game',
  backgroundColor: '#7dd7fb',
};
 
export const game = new Phaser.Game(gameConfig);
