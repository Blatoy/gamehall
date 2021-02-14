import { CPU } from "../cpu.js";

const CANVAS = document.getElementById('memory-view') as HTMLCanvasElement;
const CTX = CANVAS.getContext('2d')!;
CTX.fillStyle = 'red';
const IMGDATA = CTX.createImageData(256, 256);
const IMGDATA_SIZE = 256 * 256;

export function updateMemoryViewCanvas(cpu: CPU): void {
    for (let i = 0; i < IMGDATA_SIZE * 4; i += 4) {
        const value = cpu.memory.uint8Array[i / 4];
        IMGDATA.data[i] = value;
        IMGDATA.data[i + 1] = value;
        IMGDATA.data[i + 2] = value;
        IMGDATA.data[i + 3] = 255;
    }
    CTX.putImageData(IMGDATA, 0, 0);
    const pc = cpu.registers.pc.getUint();
    CTX.fillRect(pc % 256, Math.floor(pc / 256), 1, 1);
}

// TODO: Click to goto, shift click to set PC
