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
    this.player.playerName = this.cfg.playerName;
    console.log(this.cfg.playerName)
  }

  createWorld() {
    return new ClientWorld(this, this.engine, levelCfg);
  }

  getWorld() {
    return this.map;
  }

  initEngine() {
    this.engine.loadSprites(sprites).then(() => {
      this.map.init();
      this.engine.on('render', (_, time) => {
        this.engine.camera.focusAtGameObject(this.player);
        this.map.render(time);
      });
      this.engine.start();
      this.initKeys();
    });
  }

  initKeys() {
    this.engine.input.onKey({
      ArrowLeft: (keydown) => {
        if (keydown) {
          this.movePlayer('left');
        }
      },
      ArrowRight: (keydown) => {
        if (keydown) {
          this.movePlayer('right');
        }
      },
      ArrowUp: (keydown) => {
        if (keydown) {
          this.movePlayer('up');
        }
      },
      ArrowDown: (keydown) => {
        if (keydown) {
          this.movePlayer('down');
        }
      },
    });
  }

  movePlayer(dir) {
    const directions = {
      left: [-1, 0],
      right: [1, 0],
      up: [0, -1],
      down: [0, 1],
    };

    const { player } = this;

    if (player && player.motionProgress === 1) {
      const canMove = this.player.moveByCellCoord(
        directions[dir][0],
        directions[dir][1],
        (cell) => cell.findObjectsByType('grass').length,
      );

      if (canMove) {
        this.player.setState(dir);
        this.player.once('motion-stopped', () => this.player.setState('main'));
      }
    }
  }

  createEngine() {
    return new ClientEngine(document.getElementById(this.cfg.tagId), this);
  }

  static init(cfg) {
    if (!ClientGame.game) {
      ClientGame.game = new ClientGame(cfg);
      console.log('GAME INIT!');
    }
  }
}

export default ClientGame;
