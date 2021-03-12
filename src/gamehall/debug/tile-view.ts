import { GPU, Palette } from "../gpu.js";

const canvas = document.getElementById('tile-view') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const TILES_PER_BLOCK = 128;
const TILES_PER_ROW = 12;
const TILE_SIZE = 8;
const IMAGE_SIZE = TILES_PER_ROW * TILE_SIZE;
const SCALE = canvas.width / IMAGE_SIZE;
const BLOCK_COUNT = 3;

const imageData = ctx.createImageData(IMAGE_SIZE, IMAGE_SIZE);

const intermediateCanvas = document.createElement("canvas") as HTMLCanvasElement;
const intermediateCtx = intermediateCanvas.getContext("2d")!;

intermediateCanvas.width = IMAGE_SIZE;
intermediateCanvas.height = IMAGE_SIZE;

const colorNames = Object.keys(GPU.colorPresets);

// TODO: Proper UI
export class TileView {
    currentBlock = 0;
    lastColor = 0;

    constructor(private gpu: GPU) {
        canvas.addEventListener("click", (ev) => {
            if (ev.detail === 2) {
                // undo the next block
                this.currentBlock = (((this.currentBlock - 1) % BLOCK_COUNT) + BLOCK_COUNT) % BLOCK_COUNT;
                
                // doubleclick to change gpu colors
                this.nextColor();
            } else {
                // next block
                this.currentBlock = (this.currentBlock + 1) % BLOCK_COUNT;
            }
        });
    }

    nextColor(): void {
        this.lastColor++;
        if (this.lastColor >= colorNames.length) {
            this.lastColor = 0;
        }

        this.gpu.colors = GPU.colorPresets[colorNames[this.lastColor]];
        this.updateTileViewCanvas();
    }

    updateTileViewCanvas(): void {
        for (let tileIndex = 0; tileIndex < TILES_PER_BLOCK; tileIndex++) {
            const tileX = 8 * (tileIndex % TILES_PER_ROW);
            const tileY = 8 * Math.floor(tileIndex / TILES_PER_ROW);
    
            for (let rx = 0; rx < TILE_SIZE; rx++) {
                for (let ry = 0; ry < TILE_SIZE; ry++) {
                    const paletteIndex = this.gpu.getTileData(tileIndex, rx, ry, this.currentBlock);
    
                    const position = (tileX + rx + (ry + tileY) * IMAGE_SIZE) * 4;
                    const color = this.gpu.getPaletteColor(paletteIndex, Palette.Background);
    
                    imageData.data[position] = color[0];
                    imageData.data[position + 1] = color[1];
                    imageData.data[position + 2] = color[2];
                    imageData.data[position + 3] = color[3];
                }
            }
        }
    
        ctx.imageSmoothingEnabled = false;
        intermediateCtx.putImageData(imageData, 0, 0);
        ctx.drawImage(intermediateCanvas, 0, 0, canvas.width, canvas.width);
    
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
    
        // Render grid (TODO: Caching)
        for (let i = 0; i < TILES_PER_ROW; i += 2) {
            ctx.strokeRect(i * TILE_SIZE * SCALE, -1, TILE_SIZE * SCALE, canvas.width + 2);
            ctx.strokeRect(-1, i * TILE_SIZE * SCALE, canvas.width + 2, TILE_SIZE * SCALE);
        }
    
        // TODO: Proper UI
        ctx.fillStyle = "black";
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
        ctx.fillStyle = "white";
        ctx.fillText(`Block: ${this.currentBlock} | Palette: ${colorNames[this.lastColor]}`, 8, canvas.height - 7);
    }
}
