import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';

import sprites from '../configs/sprites';
import levelCfg from '../configs/world.json';
import gameObjects from '../configs/gameObjects.json';

class ClientGame {
  constructor(cfg) {
    Object.assign(this, {
      cfg,
      gameObjects,
      player: null,
    });

    this.engine = this.createEngine();
    this.map = this.createWorld();
    this.initEngine();
  }

  setPlayer(player) {
    this.player = player;
  }

  createWorld() {
    return new ClientWorld(this, this.engine, levelCfg);
  }

  initEngine() {
    this.engine.loadSprites(sprites).then(() => {
      this.map.init();
      this.engine.on('render', (_, time) => {
        this.map.render(time);
        // this.engine.on('render', (_, time) => {
        // console.log(_ + time);
      });
      this.engine.start();
      this.initKeys();
    });
  }

  initKeys() {
    this.engine.input.onKey({
      ArrowLeft: (keydown) => {
        if (keydown) {
          this.movePlayer(-1, 0);
        }
      },
      ArrowRight: (keydown) => {
        if (keydown) {
          this.movePlayer(1, 0);
        }
      },
      ArrowUp: (keydown) => {
        if (keydown) {
          this.movePlayer(0, -1);
        }
      },
      ArrowDown: (keydown) => {
        if (keydown) {
          this.movePlayer(0, 1);
        }
      },
    });
  }

  movePlayer(x, y) {
    this.player.moveByCellCoord(x, y, (cell) => cell.findObjectsByType('grass').length);
  }

  createEngine() {
    return new ClientEngine(document.getElementById(this.cfg.tagId));
  }

  static init(cfg) {
    if (!ClientGame.game) {
      ClientGame.game = new ClientGame(cfg);
      console.log('GAME INIT!');
    }
  }
}

export default ClientGame;
