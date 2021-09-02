import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';

import sprites from '../configs/sprites';
import levelCfg from '../configs/world.json';
import gameObjects from '../configs/gameObjects.json';
import ClientApi from './ClientApi';

class ClientGame {
  constructor(cfg) {
    Object.assign(this, {
      cfg,
      gameObjects: cfg.gameObjects,
      player: null,
      players: {},
      api: new ClientApi({
        game: this,
        ...cfg.apiCfg
      }),
      spawnPoint: []
    });

    this.api.connect();
    this.engine = this.createEngine();
    this.map = this.createWorld();
    this.initEngine();
  }

  setPlayer(player) {
    this.player = player;
    this.player.playerName = this.cfg.playerName;
  }

  createWorld() {
    return new ClientWorld(this, this.engine, this.cfg.world);
  }

  getWorld() {
    return this.map;
  }

  initEngine() {
    this.engine.loadSprites(this.cfg.sprites).then(() => {
      this.map.init();
      this.engine.on('render', (_, time) => {
        this.player && this.engine.camera.focusAtGameObject(this.player);
        this.map.render(time);
      });
      this.engine.start();
      this.initKeys();
      this.engine.focus();
      this.api.join(this.cfg.playerName);
    });
  }

  setPlayers(playersList) {
    playersList.forEach(player => {
      this.createPlayer(player);
    });
  }

  createCurrentPlayer(playerCfg) {
    const playerObj = this.createPlayer(playerCfg);

    this.setPlayer(playerObj);
  }

  createPlayer({ id, col, row, layer, skin, name}) {
    if (!this.players[id]) {
      const cell = this.map.cellAt(col, row);
      const playerObj = cell.createGameObject({
        'class': 'player',
        type: skin,
        playerId: id,
        playerName: name
      }, layer);

      cell.addGameObject(playerObj);

      this.players[id] = playerObj; 
    }

    return this.players[id];
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
    this.api.move(dir);
  }

  createEngine() {
    return new ClientEngine(document.getElementById(this.cfg.tagId), this);
  }

  getPlayerById(id) {
    return this.players[id];
  }

  removePlayerById(id) {
    const player = this.getPlayerById(id);

    if (player) {
      player.detouch();
      delete this.players[id];
    }
  }

  addSpawnPoint(spawnPoint) {
    this.spawnPoint.push(spawnPoint)
  }

  static init(cfg) {
    if (!ClientGame.game) {
      ClientGame.game = new ClientGame(cfg);
      console.log('GAME INIT!');
    }
  }
}

export default ClientGame;
