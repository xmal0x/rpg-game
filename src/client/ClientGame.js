import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';

import sprites from '../configs/sprites';
import levelCfg from '../configs/world.json';

class ClientGame {
  constructor(cfg) {
    Object.assign(this, {
      cfg,
    });
    this.engine = this.createEngine();
    this.map = this.createWorld();
    this.initEngine();
  }

  createWorld() {
    return new ClientWorld(this, this.engine, levelCfg);
  }

  initEngine() {
    this.engine.loadSprites(sprites).then(() => {
      this.engine.on('render', (_, time) => {
        console.log(_ + time);
        this.map.init();
      });
      this.engine.start();
    });
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
