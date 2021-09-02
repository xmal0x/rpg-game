import { io } from 'socket.io-client';

class ClientApi {
  constructor(cfg) {
    Object.assign(this, {
      ...cfg,
      game: cfg.game,
    });
  }

  connect() {
    const { url, path } = this;
    this.io = io(url, {
      path,
    });

    this.io.on('welcome', this.onWelcome.bind(this));
    this.io.on('join', this.onJoin.bind(this));
    this.io.on('newPlayer', this.onNewPlayer.bind(this));
    this.io.on('playerMove', this.onPlayerMove.bind(this));
    this.io.on('playerDisconnect', this.onPlayerDisconnect.bind(this));
  }

  /*eslint-disable */
  onWelcome(serverStatus) {
    console.log(serverStatus);
  }
  /* eslint-enable */

  onJoin(player) {
    this.game.createCurrentPlayer(player.player);
    this.game.setPlayers(player.playersList);
    console.log('player: ', player);
  }

  onNewPlayer(player) {
    this.game.createPlayer(player);
  }

  onPlayerMove(moveCfg) {
    const { game } = this;
    const { col, row, id } = moveCfg;
    const player = game.getPlayerById(id);

    if (player) {
      player.moveToCellCoord(col, row);
      const dir = this.getDirection(moveCfg);

      if (player.motionProgress === 1) {
        player.setState(dir);
        player.once('motion-stopped', () => player.setState('main'));
      }
    }
  }

  onPlayerDisconnect(id) {
    this.game.removePlayerById(id);
  }

  join(playerName) {
    this.io.emit('join', playerName);
  }

  move(dir) {
    this.io.emit('move', dir);
  }
  /*eslint-disable */
  getDirection({ col, row, oldRow, oldCol }) {
    if (oldCol < col) return 'right';
    if (oldCol > col) return 'left';
    if (oldRow < row) return 'down';
    if (oldRow > row) return 'up';
    return null;
  }
  /* eslint-enable */
}

export default ClientApi;
