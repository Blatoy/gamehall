import { toHex } from "../utils.js";
import { Debug } from "./debug.js";

const MAX_INSTRUCTION_COUNT = 50;
const table = document.getElementById("last-instructions") as HTMLTableElement;

export interface ExecutedInstruction {
    instructionName: string;
    offset: number;
}

export class LastInstructions {
    private instructions: ExecutedInstruction[] = []
    private refreshRequired = false;

    constructor(private debug: Debug) {
        this.debug.cpu.preExecuteHooks.push((instructionName, offset) => {
            this.addInstruction({ instructionName, offset });
            return false;
        });
    }

    reset() {
        this.instructions = [];
        this.refreshRequired = true;
        this.updateDOMTable();
    }

    addInstruction(instruction: ExecutedInstruction): void {
        if (this.instructions.length >= MAX_INSTRUCTION_COUNT) {
            this.instructions.pop();
        }

        this.refreshRequired = true;
        this.instructions.unshift(instruction);
    }

    updateDOMTable(): void {
        if (!this.refreshRequired) {
            return;
        }
        this.refreshRequired = false;

        // TODO: Clear only non-header rows, then add this back to the HTML where it "belongs"
        table.innerHTML = `<tr><th>Offset</th><th>Instruction</th></tr>`;
        for (const executedInstruction of this.instructions) {
            const newRow = table.insertRow();
            const offsetCell = newRow.insertCell();

            offsetCell.addEventListener('click', () => {
                this.debug.memoryEditor.selectedPosition = executedInstruction.offset;
            });
            offsetCell.classList.add("clickable");

            offsetCell.innerText = toHex(executedInstruction.offset, 2, '$');
            newRow.insertCell().innerText = executedInstruction.instructionName;
        }
    }

}
