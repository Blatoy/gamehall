import { CPU } from "./cpu.js";
import { GPU } from "./gpu.js";

/**
 * Divider register increment in milliseconds.
 */
const DIV_REGISTER_RATE = 1000 / 16384;

export class Clock {

    private _divRegister = 0;

    constructor(private cpu: CPU, private gpu: GPU) {
        // DIV register reset hook
        this.cpu.memory.data.hooks.push((byteOffset, length, value) => {
            // TODO: 16-bit writes
            if (byteOffset === 0xFF04) {
                this.cpu.memory.uint8Array[0xFF04] = 0;
                this._divRegister = 0;
                return false;
            }
            return true;
        });
    }

    speedFactor = 1;
    /** One clock tick may not take longer than this many milliseconds. */
    maxExecutionTime = 200;

    tick(timeAvailable: number): void {
        if (timeAvailable > this.maxExecutionTime) {
            console.warn(`Cannot keep up! Did the system time change or is the server overloaded? Running ${timeAvailable - this.maxExecutionTime}ms behind`);
            timeAvailable = this.maxExecutionTime;
        }

        while (timeAvailable > 0) {
            let elapsed = this.step();
            if (elapsed === null) {
                break;
            } else {
                timeAvailable -= elapsed / this.speedFactor;
            }
        }
    }

    /**
     * Returns the ms that elapsed as a consequence of this step, or null if the clock tick should be broken out of.
     */
    step(): number | null {
        if (this.cpu.checkInterrupts()) {
            // Interrupt!
            // TODO: Check if this needs to consume machine cycles (because of the CALL instruction)
        }

        let { instruction, elapsed } = this.cpu.executeInstructionFromMemory();
        if (elapsed === null) {
            // Execution of this instruction was cancelled (e.g. breakpoint)
            return null;
        } else if (elapsed <= 0) {
            throw new Error('Instruction ' + instruction.name + ' returned invalid duration ' + elapsed);
        }

        // Cumulate DIV register changes over time
        this._divRegister = this._divRegister + DIV_REGISTER_RATE * elapsed;
        if (this._divRegister >= 1) {
            this.cpu.memory.uint8Array[0xFF04] = this.cpu.memory.uint8Array[0xFF04] + this._divRegister;
            this._divRegister -= Math.floor(this._divRegister);
        }

        // GPU tick
        this.gpu.tick(elapsed);

        return elapsed;
    }
}
