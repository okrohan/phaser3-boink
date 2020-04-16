import  { Game,Types, AUTO} from 'phaser'
import {GameScene} from "./scenes/game";

const gameConfig: Types.Core.GameConfig = {
  title: 'Sample',
  type: AUTO,
  scene:GameScene,
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
 
export const game = new Game(gameConfig);
