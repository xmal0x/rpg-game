class ClientWorld {
  constructor(game, engine, levelCfg) {
    Object.assign(this, {
      game,
      engine,
      levelCfg,
      height: levelCfg.map.length,
      width: levelCfg.map[0].length,
      spriteH: 48,
      spriteW: 48,
    });
  }

  init() {
    for (let i = 0; i < this.width; i += 1) {
      for (let j = 0; j < this.height; j += 1) {
        this.engine.renderSpriteFrame({
          sprite: ['terrain', this.levelCfg.map[i][j]],
          frame: 0,
          x: i * this.spriteW,
          y: j * this.spriteH,
          w: this.spriteW,
          h: this.spriteH,
        });
      }
    }
  }
}

export default ClientWorld;
