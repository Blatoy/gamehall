import { Memory } from "./memory.js";

export class GPU {
    private availableTime = 0;

    private scanX = 0;
    private scanY = 0;

    constructor(private memory: Memory) { }

    tick(time: number): void {
        this.availableTime += time;
        
        // Debug scanline
       /* this.scanY++;
        if (this.scanY > 1000) {
            this.scanY = 0;
            this.memory.uint8Array[0xFF44]++;
            
            if (this.memory.uint8Array[0xFF44] > 153) {
                this.memory.uint8Array[0xFF44] = 0;
            }
            // request interrupt
            this.memory.uint8Array[0xFF0F] = 0xFF;
        }*/

        // background and character/tile maps should be stored as Uint8Arrays (color indices).
        // we paint scanlines onto a temporary ImageData, which is painted to the canvas once a frame completes (or when we took to long to paint it)

        // we have a current gpu state (not the same a mode which is reflected in the gameboy memory)
        // each state does something different (drawing pixel line, move cursor back, etc)
        // -> basically updating variables so we can draw "step by step"
        // if we run into something that interupt, we instantly break out of the availableTime loop (with remaining time left, which is kept for the next gpu tick so we can "catch up")

        while (this.availableTime > 0) {
            // do something, maybe -= availableTime
            // may break if interupt
            break;
        }
    }
}
