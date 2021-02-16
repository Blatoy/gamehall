import { CPU } from "./cpu.js";
import { GPU } from "./gpu.js";

export class Clock {

    constructor(private cpu: CPU, private gpu: GPU) { }

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
            // TODO: Check if this needs to consume clock cycles (because of the CALL instruction)
        }

        let { instruction, elapsed } = this.cpu.executeInstruction();
        if (elapsed === null) {
            // Execution of this instruction was cancelled (e.g. breakpoint)
            return null;
        } else if (elapsed <= 0) {
            throw new Error('Instruction ' + instruction.name + ' returned invalid duration ' + elapsed);
        }

        this.gpu.tick(elapsed);

        return elapsed;
    }
}
