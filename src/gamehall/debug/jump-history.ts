import { Interrupt } from "../cpu.js";
import { toHex } from "../utils.js";
import { Debug } from "./debug.js";

const MAX_INSTRUCTION_COUNT = 50;
const TABLE = document.getElementById("jump-history") as HTMLTableElement;

export interface ExecutedJump {
    source: number;
    destination: number;
    instructionName: string;
}

export class JumpHistory {
    private instructions: ExecutedJump[] = []
    private refreshRequired = false;
    lastRelevantOffset?: number;

    constructor(private debug: Debug) {
        this.debug.cpu.interruptHooks.push((interruptIndex, interruptVector) => {
            this.addInterrupt(interruptIndex, interruptVector);
            return false;
        });

        this.debug.cpu.preExecuteHooks.push((instructionName, offset) => {
            if (this.isRelevantInstruction(instructionName)) {
                this.lastRelevantOffset = offset;
            }
            return false;
        });
        this.debug.cpu.postExecuteHooks.push((instructionName, offset, result) => {
            if (this.lastRelevantOffset !== undefined && this.didConditionalJumpHappen(instructionName, result.machineCycles)) {
                const pcValue = this.debug.cpu.registers.pc.getUint();
                this.addInstruction({ source: this.lastRelevantOffset, destination: pcValue, instructionName });
            }
            this.lastRelevantOffset = undefined;
        });
    }

    reset() {
        this.instructions = [];
        this.refreshRequired = true;
        this.updateDOMTable();
    }

    addInterrupt(interruptIndex: Interrupt, interruptVector: number) {
        const interruptName = Interrupt[interruptIndex];
        this.addInstruction({ instructionName: `Interrupt "${interruptName}"`, source: this.debug.cpu.registers.pc.getUint(), destination: interruptVector });
    }

    addInstruction(instruction: ExecutedJump): void {
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
        TABLE.innerHTML = `<tr><th>Source</th><th style="width: 100%">Instruction</th><th>Target</th></tr>`;
        for (const executedInstruction of this.instructions) {
            const newRow = TABLE.insertRow();
            const sourceCell = newRow.insertCell();

            sourceCell.addEventListener('click', () => {
                this.debug.memoryEditor.selectedPosition = executedInstruction.source;
            });
            sourceCell.classList.add("clickable");

            sourceCell.innerText = toHex(executedInstruction.source, 2, '$');
            newRow.insertCell().innerText = executedInstruction.instructionName;

            const destinationCell = newRow.insertCell();

            destinationCell.addEventListener('click', () => {
                this.debug.memoryEditor.selectedPosition = executedInstruction.destination;
            });
            destinationCell.classList.add("clickable");

            destinationCell.innerText = toHex(executedInstruction.destination, 2, '$');
        }
    }

    isRelevantInstruction(instructionName: string): boolean {
        return /^(JP|JR|RST|RET|CALL)/g.test(instructionName);
    }

    didConditionalJumpHappen(instructionName: string, machineCycles: number): boolean {
        // TODO: Add a property to InstructionExecuteOutput "didJump" instead
        switch (instructionName) {
            case 'JR nz,r8':
            case 'JR z,r8':
            case 'JR nc,r8':
            case 'JR c,r8':
                return machineCycles === 3;
            case 'JP nz,r8':
            case 'JP z,r8':
            case 'JP nc,r8':
            case 'JP c,r8':
                return machineCycles === 4;
            case 'CALL nz,a16':
            case 'CALL z,a16':
            case 'CALL nc,a16':
            case 'CALL c,a16':
                return machineCycles === 6;
            case 'RET nz':
            case 'RET z':
            case 'RET nc':
            case 'RET c':
                return machineCycles === 5;
            default:
                // Unconditional jump
                return true;
        }
    }

}
