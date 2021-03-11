import { Memory } from "./memory.js";
import { MACHINE_CYCLE_SPEED } from './cpu.js';
import { toHex } from "./utils.js";

const OAM_DMA_CYCLES = 160;
const SEARCHING_OAM_CYCLES = 20;
const H_LINE_MIN_CYCLES = 43;
const H_LINE_MAX_CYCLES = 72;
const H_PIXEL_MIN_CYCLES = H_LINE_MIN_CYCLES / 160;
const H_PIXEL_MAX_CYCLES = H_LINE_MAX_CYCLES / 160;
const H_LINE_CYCLES = 114;
const H_LINE_DRAWING_AND_BLANK_CYCLES = H_LINE_CYCLES - SEARCHING_OAM_CYCLES;
const V_BLANK_CYCLES = 10 * H_LINE_CYCLES;

const TILE_X_COUNT = 32;
const TILE_WIDTH = 8;
const TILE_HEIGHT = 8;

enum GPUMode {
    HBlank,
    VBlank,
    SearchingOAM,
    Drawing
}

export class GPU {
    private availableTime = 0;

    private scanX = 0;
    private scanY = 0;

    get memoryScanY(): number {
        return this.memory.uint8Array[0xFF44];
    }

    set memoryScanY(value: number) {
        this.memory.uint8Array[0xFF44] = value;
    }

    frameImageData: ImageData;
    renderedFrameHooks: RenderedFrameHook[] = [];
    modeTime = SEARCHING_OAM_CYCLES * MACHINE_CYCLE_SPEED;
    mode = GPUMode.SearchingOAM;

    screenOff = false;
    oamDmaAddress: number | undefined = undefined;
    oamDmaProgress = 0;

    constructor(private memory: Memory) {
        this.frameImageData = new ImageData(160, 144);

        this.memory.data.hooks.push((byteOffset, length, value) => {
            if (byteOffset === 0xFF46) {
                // Start DMA transfer
                console.log('start DMA transfer', toHex(value));
                this.oamDmaAddress = (value % 0xE0) * 100;
            }

            // TODO: During certain GPU modes, block writes to OAM (maybe console.warn them?)
            return true;
        });
    }

    debugFrameTime = 0;
    debugInfo: { type: string, time: number, cycles: number }[] = [];

    tick(time: number): void {
        this.availableTime += time;
        
        // background and character/tile maps should be stored as Uint8Arrays (color indices).
        // we paint scanlines onto a temporary ImageData, which is painted to the canvas once a frame completes (or when we took to long to paint it)

        // we have a current gpu state (not the same a mode which is reflected in the gameboy memory)
        // each state does something different (drawing pixel line, move cursor back, etc)
        // -> basically updating variables so we can draw "step by step"
        // if we run into something that interupt, we instantly break out of the availableTime loop (with remaining time left, which is kept for the next gpu tick so we can "catch up")

        if (this.oamDmaAddress !== undefined) {
            // TODO: if OAM DMA is happening, CPU can only access HRAM (FF80 - FFFE)

            // 1 machine cycle means 1 byte of OAM data transferred
            const lastProgress = this.oamDmaProgress;
            this.oamDmaProgress += time / MACHINE_CYCLE_SPEED;

            for (let i = Math.floor(lastProgress); i < Math.min(160, Math.floor(this.oamDmaProgress)); i++) {
                this.memory.uint8Array[0xFE00 + i] = this.memory.uint8Array[this.oamDmaAddress + i];
            }

            if (this.oamDmaProgress >= OAM_DMA_CYCLES) {
                // Finish DMA transfer
                this.oamDmaAddress = undefined;
                this.oamDmaProgress = 0;
            }
        }

        if ((this.memory.uint8Array[0xFF40] & 0b1000_0000) === 0) {
            // LCD off flag
            if (!this.screenOff) {
                // On -> Off: Clear backbuffer
                for (let i = 0; i < this.frameImageData.data.length; i++) {
                    this.frameImageData.data[i] = colors[16 + (i % 4)];
                }

                this.screenOff = true;
                this.finishedFrame(false);
            }
            return;
        }
        this.screenOff = false;

        loop:
        while (this.availableTime > 0) {
            switch (this.mode) {
                case GPUMode.HBlank:
                    const hblankStep = MACHINE_CYCLE_SPEED;
                    if (!this.decrementAvailableTime(hblankStep)) {
                        break loop;
                    }

                    this.modeTime -= hblankStep;
                    if (this.modeTime <= 0) {
                        this.scanX = 0;
                        this.scanY++;
                        this.memoryScanY = this.scanY;

                        if (this.scanY >= 144) {
                            // this.debugInfo.push({ type: 'start vblank', time: this.debugFrameTime, cycles: this.debugFrameTime / MACHINE_CYCLE_SPEED });
                            this.mode = GPUMode.VBlank;
                            this.modeTime = V_BLANK_CYCLES * MACHINE_CYCLE_SPEED;

                            this.finishedFrame();
                            break loop;
                        } else {
                            // this.debugInfo.push({ type: 'hblank is done', time: this.debugFrameTime, cycles: this.debugFrameTime / MACHINE_CYCLE_SPEED });
                            this.mode = GPUMode.SearchingOAM;
                            this.modeTime = SEARCHING_OAM_CYCLES * MACHINE_CYCLE_SPEED;
                        }
                    }
                    break;
                case GPUMode.VBlank:
                    const vblankStep = H_LINE_CYCLES * MACHINE_CYCLE_SPEED;
                    if (!this.decrementAvailableTime(vblankStep)) {
                        break loop;
                    }

                    if (this.memoryScanY <= 153) {
                        // TODO: Check if this check is an issue
                        this.memoryScanY++;
                    }

                    this.modeTime -= vblankStep;
                    if (this.modeTime <= 0) {
                        // this.debugInfo.push({ type: 'vblank done', time: this.debugFrameTime, cycles: this.debugFrameTime / MACHINE_CYCLE_SPEED });
                        this.scanX = 0;
                        this.scanY = 0;
                        this.memoryScanY = 0;
                        this.mode = GPUMode.SearchingOAM;
                        this.modeTime = SEARCHING_OAM_CYCLES * MACHINE_CYCLE_SPEED;
                    }
                    break;
                case GPUMode.SearchingOAM:
                    if (!this.decrementAvailableTime(MACHINE_CYCLE_SPEED)) {
                        break loop;
                    }

                    this.modeTime -= MACHINE_CYCLE_SPEED;
                    if (this.modeTime <= 0) {
                        // this.debugInfo.push({ type: 'Seaching OAM is done', time: this.debugFrameTime, cycles: this.debugFrameTime / MACHINE_CYCLE_SPEED });
                        this.mode = GPUMode.Drawing;
                        this.modeTime = 0;
                    }
                    break;
                case GPUMode.Drawing:
                    const random = Math.random(); // TODO: Estimation based on number of sprites on a line
                    const pixelCycles = (random * H_PIXEL_MIN_CYCLES) + ((1 - random) * H_PIXEL_MAX_CYCLES);
                    const pixelDuration = pixelCycles * MACHINE_CYCLE_SPEED;
                    if (!this.decrementAvailableTime(pixelDuration)) {
                        break loop;
                    }

                    // Draw a pixel
                    this.draw();

                    this.scanX++;
                    this.modeTime += pixelDuration;

                    if (this.scanX >= 160) {
                        // this.debugInfo.push({ type: 'scanX is 160', time: this.debugFrameTime, cycles: this.debugFrameTime / MACHINE_CYCLE_SPEED });
                        this.mode = GPUMode.HBlank;
                        this.modeTime = H_LINE_DRAWING_AND_BLANK_CYCLES * MACHINE_CYCLE_SPEED - this.modeTime;
                    }
                    break;
            }
        }
    }

    draw(): void {
        const position = (this.scanX + this.scanY * this.frameImageData.width) * 4;
        const paletteIndex = this.getBgMapData1(this.scanX + this.memory.uint8Array[0xFF43], this.scanY + this.memory.uint8Array[0xFF42]);
        const color = this.getPaletteColor(paletteIndex, Palette.Background);

        this.frameImageData.data[position] = color[0];
        this.frameImageData.data[position + 1] = color[1];
        this.frameImageData.data[position + 2] = color[2];
        this.frameImageData.data[position + 3] = color[3];
    }

    finishedFrame(interrupt = true): void {
        // Send frame to listeners
        for (const hook of this.renderedFrameHooks) {
            hook(this.frameImageData);
        }

        if (interrupt) {
            // Request interrupt
            this.memory.uint8Array[0xFF0F] |= 0b0000_0001;
        }

        // console.log('Frame time: ', this.debugFrameTime, 'info', JSON.parse(JSON.stringify(this.debugInfo)));
        // this.debugFrameTime = 0;
        // this.debugInfo = [];
    }

    decrementAvailableTime(amount: number): boolean {
        if (this.availableTime < amount) {
            return false;
        }

        this.availableTime -= amount;
        this.debugFrameTime += amount;
        return true;
    }

    getTileIndex(px: number, py: number, bgMap: number): number {
        px = px % 256;
        py = py % 256;

        // 1: px, py to tile index
        let bgMapAddress: number;
        switch (bgMap) {
            case 0:
                bgMapAddress = 0x9800;
                break;
            case 1:
                bgMapAddress = 0x9C00;
                break;
            default:
                throw new Error('Unknown bgMap ' + bgMap);
        }

        const tx = Math.floor(px / TILE_WIDTH);
        const ty = Math.floor(py / TILE_HEIGHT);
        return this.memory.uint8Array[bgMapAddress + tx + ty * TILE_X_COUNT];
    }

    /**
     * Returns palette index for given pixel coordinate (either relative to screen or to tile) into tile data.
     * @param bgMap BGMap 0 is $9800-9BFF
     * BGMap 1 is $9C00-9FFF
     * @param block Block 0 is $8000-87FF
     * Block 1 is $8800-8FFF
     * Block 2 is $9000-97FF
     */
    getTileData(tileIndex: number, rx: number, ry: number, block: number): number {
        let blockAddress: number;
        switch (block) {
            case 0:
                blockAddress = 0x8000;
                break;
            case 1:
                blockAddress = 0x8800;
                break;
            case 2:
                blockAddress = 0x9000;
                break;
            default:
                throw new Error('Unknown block ' + block);
        }

        /*
                         Background map data
                 0                      1
            4px      4px         4px      4px
        1px byte 0   byte 1      byte 16  byte 17
        1px byte 2   byte 3      byte 18  byte 19
        1px byte 4   byte 5      byte 20  byte 21
        1px byte 6   byte 7      byte 22  byte 23
        1px byte 8   byte 9      byte 24  byte 25
        1px byte 10  byte 11     byte 26  byte 27
        1px byte 12  byte 13     byte 28  byte 29
        1px byte 14  byte 15     byte 30  byte 31

            4px       4px        01234567  01234567
        1px byte 512 byte 513    uuuuuuuu  llllllll
        1px byte 514 byte 515    ^----+----^
        1px byte 516 byte 517         |
        1px byte 518 byte 519    first bit of both
        1px byte 520 byte 521    bytes equals the
        1px byte 522 byte 523    first pixel's color
        1px byte 524 byte 525
        1px byte 526 byte 527

        */

        // 2: rx, ry to byte offset (in the tile)
        rx = rx % TILE_WIDTH;
        ry = ry % TILE_HEIGHT;
        const byteOffset = ry * 2;

        // 3: Retrieve bit pair at the correct index
        // TODO: 3 different block indexing methods
        const tileByteUpper = this.memory.uint8Array[blockAddress + tileIndex * 16 + byteOffset];
        const tileByteLower = this.memory.uint8Array[blockAddress + tileIndex * 16 + byteOffset + 1];
        const maskedByteUpper = (0b1000_0000 >> rx) & tileByteUpper;
        const maskedByteLower = (0b1000_0000 >> rx) & tileByteLower;

        // Right-shift by -1 does not work, do a left-shift instead
        let bitValue: number;
        if (rx === 7) {
            bitValue = (maskedByteUpper << 1) | maskedByteLower;
        } else {
            bitValue = (maskedByteUpper >> (6 - rx)) | (maskedByteLower >> (7 - rx));
        }

        return bitValue;
    }

    getBgMapData1(px: number, py: number): number {
        return this.getTileData(this.getTileIndex(px, py, 0), px, py, 0);
    }

    getPaletteColor(value: number, paletteData: Palette): Uint8ClampedArray {
        let address: number;
        switch (paletteData) {
            case Palette.Background:
                address = 0xFF47;
                break;
            case Palette.Object0:
                address = 0xFF48;
                break;
            case Palette.Object1:
                address = 0xFF49;
                break;
        }
        const palette = this.memory.uint8Array[address];

        let colorIndex: number;
        switch (value) {
            case 0:
                colorIndex = palette & 0b0000_0011;
                break;
            case 1:
                colorIndex = (palette & 0b0000_1100) >> 2;
                break;
            case 2:
                colorIndex = (palette & 0b0011_0000) >> 4;
                break;
            case 3:
                colorIndex = (palette & 0b1100_0000) >> 6;
                break;
            default:
                throw new Error('Invalid color index specified.');
        }

        return colors.slice(colorIndex * 4, colorIndex * 4 + 4);
    }

    readFromOAM(byteOffset: number): number {
        if (this.oamDmaAddress === undefined) {
            return this.memory.uint8Array[byteOffset];
        }

        return 0xFF;
    }
}

export enum Palette {
    Background,
    Object0,
    Object1
}

type Color = [number, number, number, number];

const colors = makeColors(
    // Regular palette
    [155, 188, 15, 255],
    [139, 172, 15, 255],
    [48, 98, 48, 255],
    [15, 56, 15, 255],
    // Clear color
    [200, 200, 100, 255]
);

function makeColors(...colors: Color[]) {
    const length = colors.length * 4 /* rgba */;
    const buffer = new ArrayBuffer(length);
    const array = new Uint8ClampedArray(buffer);
    for (let i = 0; i < length; i += 4) {
        array.set(colors[i / 4], i);
    }
    return array;
}

/**
 * Returns the original image data of that frame. Must be copied if you don't want it to be updated later.
 */
export type RenderedFrameHook = (frame: ImageData) => void;
