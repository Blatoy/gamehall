import { Memory } from "./memory.js";

export class GPU {
    private availableTime = 0;

    constructor(private memory: Memory) { }

    tick(time: number): void {
        this.availableTime += time;

        while (this.availableTime > 0) {
            // do something, maybe -= availableTime
            // may break if interupt
            break;
        }
    }
}
