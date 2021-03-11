import { CPU } from "../cpu.js";

const canvas = document.getElementById('memory-view') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const imgdata = ctx.createImageData(256, 256);
const imgdataSize = 256 * 256;

const overlayCanvas = document.createElement("canvas");

function generateOverlay() {
    const imageDataOverlay = ctx.createImageData(256, 256);
    overlayCanvas.width = 256;
    overlayCanvas.height = 256;

    const overlayCtx = overlayCanvas.getContext("2d");
    
    for (let i = 0; i < imgdataSize * 4; i += 4) {
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

    overlayCtx?.putImageData(imageDataOverlay, 0, 0);
}

export function updateMemoryViewCanvas(cpu: CPU): void {
    for (let i = 0; i < imgdataSize * 4; i += 4) {
        const value = cpu.memory.uint8Array[i / 4];

        imgdata.data[i] = value;
        imgdata.data[i + 1] = value;
        imgdata.data[i + 2] = value;
        imgdata.data[i + 3] = 255;
    }

    ctx.putImageData(imgdata, 0, 0);
    ctx.globalAlpha = 0.2;
    ctx.drawImage(overlayCanvas, 0, 0);
    ctx.globalAlpha = 1;

    const pc = cpu.registers.pc.getUint();
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(pc % 256 - 1, Math.floor(pc / 256) - 1, 3, 3);

    const sp = cpu.registers.sp.getUint();
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(sp % 256 - 1, Math.floor(sp / 256) - 1, 3, 3);
}

generateOverlay();
