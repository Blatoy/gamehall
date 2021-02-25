import { CPU } from "../cpu.js";
import { GPU, Palette } from "../gpu.js";

const TILES_PER_BLOCK = 128;
const TILES_PER_ROW = 12;
const TILE_SIZE = 8;
const IMAGE_SIZE = TILES_PER_ROW * TILE_SIZE;


const CANVAS = document.getElementById('tile-view') as HTMLCanvasElement;
const CTX = CANVAS.getContext('2d')!;

const IMAGE_DATA = CTX.createImageData(IMAGE_SIZE, IMAGE_SIZE);

const INTERMEDIATE_CANVAS = document.createElement("canvas") as HTMLCanvasElement;
const INTERMEDIATE_CTX = INTERMEDIATE_CANVAS.getContext("2d")!;

INTERMEDIATE_CANVAS.width = IMAGE_SIZE;
INTERMEDIATE_CANVAS.height = IMAGE_SIZE;

const SCALE =  CANVAS.width / IMAGE_SIZE;

const BLOCK_COUNT = 3;
let currentBlock = 0;

// TODO: Proper UI
CANVAS.addEventListener("click", () => {
    currentBlock = (currentBlock + 1) % BLOCK_COUNT;
});

export function updateTileViewCanvas(cpu: CPU, gpu: GPU): void {
    for (let tileIndex = 0; tileIndex < TILES_PER_BLOCK; tileIndex++) {
        const tileX = 8 * (tileIndex % TILES_PER_ROW);
        const tileY = 8 * Math.floor(tileIndex / TILES_PER_ROW);

        for (let rx = 0; rx < TILE_SIZE; rx++) {
            for (let ry = 0; ry < TILE_SIZE; ry++) {
                const paletteIndex = gpu.getTileData(tileIndex, rx, ry, currentBlock);

                const position = (tileX + rx + (ry + tileY) * IMAGE_SIZE) * 4;
                const color = gpu.getPaletteColor(paletteIndex, Palette.Background);

                IMAGE_DATA.data[position] = color[0];
                IMAGE_DATA.data[position + 1] = color[1];
                IMAGE_DATA.data[position + 2] = color[2];
                IMAGE_DATA.data[position + 3] = color[3];
            }
        }
    }

    CTX.imageSmoothingEnabled = false;
    INTERMEDIATE_CTX.putImageData(IMAGE_DATA, 0, 0);
    CTX.drawImage(INTERMEDIATE_CANVAS, 0, 0, CANVAS.width, CANVAS.width);

    CTX.strokeStyle = "black";
    CTX.lineWidth = 1;

    // Render grid (TODO: Caching)
    for (let i = 0; i < TILES_PER_ROW; i += 2) {
        CTX.strokeRect(i * TILE_SIZE * SCALE, -1, TILE_SIZE * SCALE, CANVAS.width + 2);
        CTX.strokeRect(-1, i * TILE_SIZE * SCALE, CANVAS.width + 2, TILE_SIZE * SCALE);
    }

    // TODO: Proper UI
    CTX.fillStyle = "black";
    CTX.fillRect(0, CANVAS.height - 20, CANVAS.width, 20);
    CTX.fillStyle = "white";
    CTX.fillText("Block: " + currentBlock.toString(), 8, CANVAS.height - 7);
}
