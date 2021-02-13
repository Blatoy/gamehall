import { interfaces } from "mocha";
import { CPU } from "../cpu.js";
import { Instruction } from "../instruction.js";
import { toHex } from "../utils.js";

const MAX_INSTRUCTION_COUNT = 50;
const TABLE = document.getElementById("last-instructions") as HTMLTableElement;

export interface ExecutedInstruction {
    instruction: Instruction;
    offset: number;
}

export class LastInstructions {
    private instructions: ExecutedInstruction[] = []

    constructor(cpu: CPU) {
        cpu.preExecuteHooks.push(({ instruction, offset }) => {
            this.addInstruction({ instruction, offset });
        });
    }

    addInstruction(instruction: ExecutedInstruction): void {
        if(this.instructions.length >= MAX_INSTRUCTION_COUNT) {
            this.instructions.pop();
        }

        this.instructions.unshift(instruction);
    }

    updateDOMTable(): void {
        // TODO: Clear only non-header rows, then add this back to the HTML where it "belongs"
        TABLE.innerHTML = `<tr><th>Offset</th><th>Instruction</th></tr>`;
        for (const executedInstruction of this.instructions) {
            const newRow = TABLE.insertRow();
            newRow.insertCell().innerText = toHex(executedInstruction.offset, 2, '$');
            newRow.insertCell().innerText = executedInstruction.instruction.name;
        }
    }

}