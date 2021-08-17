import PositionedObject from '../common/PositionedObject';
import ClientCell from './ClientCell';
import { clamp } from '../common/util';

class ClientWorld extends PositionedObject {
  constructor(game, engine, levelCfg) {
    super();
    const worldHeight = levelCfg.map.length;
    const worldWidth = levelCfg.map[0].length;
    const cellSize = engine.canvas.height / levelCfg.camera.height;

    Object.assign(this, {
      game,
      engine,
      levelCfg,
      height: worldHeight * cellSize,
      width: worldWidth * cellSize,
      worldHeight,
      worldWidth,
      cellWidth: cellSize,
      cellHeight: cellSize,
      map: [],
    });
  }

  init() {
    const {
      levelCfg, map, worldWidth, worldHeight,
    } = this;

    for (let row = 0; row < worldHeight; row += 1) {
      for (let col = 0; col < worldWidth; col += 1) {
        if (!map[row]) {
          map[row] = [];
        }

        map[row][col] = new ClientCell({
          world: this,
          cellCol: col,
          cellRow: row,
          cellCfg: levelCfg.map[row][col],
        });
      }
    }
  }
  /*eslint-disable */
  render(time) {
    const { levelCfg, map, worldWidth, worldHeight } = this;

    for (let layerId = 0; layerId < levelCfg.layers.length; layerId += 1) {
      const layer = levelCfg.layers[layerId];

      if (layer.isStatic) {
        this.renderStaticLayer(time, layer, layerId);
      } else {
        this.renderDynamicLayer(time, layerId, this.getRenderRange());
      }
    }
  }
  /* eslint-enable */

  renderStaticLayer(time, layer, layerId) {
    const { engine } = this;
    const { camera } = engine;

    const layerName = `static_layer_${layerId}`;
    const cameraPos = camera.worldBounds();

    if (!layer.isRendered) {
      engine.addCanvas(layerName, this.width, this.height);
      engine.switchCanvas(layerName);

      camera.moveTo(0, 0, false);

      this.renderDynamicLayer(time, layerId);

      camera.moveTo(cameraPos.x, cameraPos.y, false);

      engine.switchCanvas('main');
      /*eslint-disable */
      layer.isRendered = true;
      /* eslint-enable */
    }

    engine.renderCanvas(layerName, cameraPos, {
      x: 0,
      y: 0,
      width: cameraPos.width,
      height: cameraPos.height,
    });
  }

  renderDynamicLayer(time, layerId, rangeCells) {
    const { map, worldWidth, worldHeight } = this;
    /*eslint-disable */
    if (!rangeCells) {
      rangeCells = {
        startCell: this.cellAt(0, 0),
        endCell: this.cellAt(worldWidth - 1, worldHeight - 1),
      };
    }
    /* eslint-enable */
    const { startCell, endCell } = rangeCells;

    for (let { row } = startCell; row <= endCell.row; row += 1) {
      for (let { col } = startCell; col <= endCell.col; col += 1) {
        map[row][col].render(time, layerId);
      }
    }
  }

  cellAtXY(x, y) {
    const {
      width, height, cellWidth, cellHeight,
    } = this;
    /*eslint-disable */
    return this.cellAt((clamp(x, 0, width - 1) / cellWidth) | 0, (clamp(y, 0, height - 1) / cellHeight) | 0);
    /* eslint-enable */
  }

  getRenderRange() {
    const {
      x, y, width, height,
    } = this.engine.camera.worldBounds();
    const { cellWidth, cellHeight } = this;

    return {
      startCell: this.cellAtXY(x - cellWidth, y - cellHeight),
      endCell: this.cellAtXY(x + width + cellWidth, y + height + cellHeight),
    };
  }

  cellAt(col, row) {
    return this.map[row] && this.map[row][col];
  }
}

export default ClientWorld;
