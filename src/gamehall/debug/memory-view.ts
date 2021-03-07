import { CPU } from "../cpu.js";

const CANVAS = document.getElementById('memory-view') as HTMLCanvasElement;
const CTX = CANVAS.getContext('2d')!;
const IMGDATA = CTX.createImageData(256, 256);
const IMGDATA_SIZE = 256 * 256;

const overlayCanvas = document.createElement("canvas");

function generateOverlay() {
    const imageDataOverlay = CTX.createImageData(256, 256);
    overlayCanvas.width = 256;
    overlayCanvas.height = 256;

    const ctx = overlayCanvas.getContext("2d");
    
    for (let i = 0; i < IMGDATA_SIZE * 4; i += 4) {
        const addr = i / 4;

        if (addr >= 0x014F && addr <= 0x3FFF) {
            // ROM Bank 0
            imageDataOverlay.data[i] = 255;
            imageDataOverlay.data[i + 1] = 0;
            imageDataOverlay.data[i + 2] = 0;
            imageDataOverlay.data[i + 3] = 255;
        } else if (addr >= 0x4000 && addr <= 0x7FFF) {
            // ROM Switchable bank
            imageDataOverlay.data[i] = 0;
            imageDataOverlay.data[i + 1] = 255;
            imageDataOverlay.data[i + 2] = 0;
            imageDataOverlay.data[i + 3] = 255;
        } else if (addr >= 0x8000 && addr <= 0x9FFF) {
            // VRAM
            imageDataOverlay.data[i] = 255;
            imageDataOverlay.data[i + 1] = 0;
            imageDataOverlay.data[i + 2] = 0;
            imageDataOverlay.data[i + 3] = 255;
        } else if (addr >= 0xA000 && addr <= 0xBFFF) {
            // Switchable RAM
            imageDataOverlay.data[i] = 0;
            imageDataOverlay.data[i + 1] = 255;
            imageDataOverlay.data[i + 2] = 0;
            imageDataOverlay.data[i + 3] = 255;
        } else if (addr >= 0xC000 && addr <= 0xDFFF) {
            // Internal RAM
            imageDataOverlay.data[i] = 255;
            imageDataOverlay.data[i + 1] = 0;
            imageDataOverlay.data[i + 2] = 0;
            imageDataOverlay.data[i + 3] = 255;
        }
    }

    ctx?.putImageData(imageDataOverlay, 0, 0);
}

export function updateMemoryViewCanvas(cpu: CPU): void {
    for (let i = 0; i < IMGDATA_SIZE * 4; i += 4) {
        const value = cpu.memory.uint8Array[i / 4];

        IMGDATA.data[i] = value;
        IMGDATA.data[i + 1] = value;
        IMGDATA.data[i + 2] = value;
        IMGDATA.data[i + 3] = 255;
    }

    CTX.putImageData(IMGDATA, 0, 0);
    CTX.globalAlpha = 0.2;
    CTX.drawImage(overlayCanvas, 0, 0);
    CTX.globalAlpha = 1;

    const pc = cpu.registers.pc.getUint();
    CTX.fillStyle = '#ff0000';
    CTX.fillRect(pc % 256 - 1, Math.floor(pc / 256) - 1, 3, 3);

    const sp = cpu.registers.sp.getUint();
    CTX.fillStyle = '#00ff00';
    CTX.fillRect(sp % 256 - 1, Math.floor(sp / 256) - 1, 3, 3);
}

generateOverlay();
