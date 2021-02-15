import { CPU } from "../cpu.js";
import { toHex } from "../utils.js";
import { Debug, getValueFromString } from "./debug.js";

const ROW_COUNT = 0x10;
const COLUMN_COUNT = 0x10;
const MAX_ROW_OFFSET = 0x1000 - ROW_COUNT;
const MEMORY_SIZE = 0xFFFF;

const TABLE = document.getElementById("memory-table") as HTMLTableElement;
const PC_ADDRESS = document.getElementById("pc-address") as HTMLSpanElement;
const OPCODE_AT_PC = document.getElementById("instruction-at-pc") as HTMLTableDataCellElement;
const OPCODE_AT_SELECTION = document.getElementById("instruction-at-selected") as HTMLTableDataCellElement;
const FOLLOW_PC = document.getElementById("follow-pc") as HTMLInputElement;
const GOTO_INPUT = document.getElementById("goto-input") as HTMLInputElement;
const SET_VALUE_INPUT = document.getElementById("set-value-input") as HTMLInputElement;
const CANVAS = document.getElementById("memory-table-scrollbar") as HTMLCanvasElement;
const CTX = CANVAS.getContext("2d")!;

export class MemoryEditor {
    private _selectedPosition = 0;
    private _rowOffset = 0;
    private draggingScrollbar = false;
    breakpoints: number[] = [];
    skipNextBreakpoint = false;

    get rows(): HTMLTableRowElement[] {
        return Array.from(TABLE.children[0].children).slice(1) as HTMLTableRowElement[];
    }

    get rowOffset(): number {
        return this._rowOffset;
    }
    set rowOffset(value: number) {
        this._rowOffset = value;

        if (this.rowOffset < 0) {
            this.rowOffset = 0;
        }

        if (this.rowOffset > MAX_ROW_OFFSET) {
            this.rowOffset = MAX_ROW_OFFSET;
        }
    }

    get selectedPosition(): number {
        return this._selectedPosition;
    }
    set selectedPosition(value: number) {
        this._selectedPosition = value;

        if (this.selectedPosition < 0) {
            this.selectedPosition = 0;
        }

        if (this.selectedPosition > MEMORY_SIZE) {
            this.selectedPosition = MEMORY_SIZE;
        }

        const selectedRow = Math.floor((this.selectedPosition / COLUMN_COUNT));
        if (selectedRow < this.rowOffset || selectedRow >= this.rowOffset + ROW_COUNT) {
            this.rowOffset = selectedRow - (ROW_COUNT / 2);
        }

        OPCODE_AT_SELECTION.innerHTML = this.cpu.getInstruction(this.selectedPosition).instruction?.name || '???';
    }

    constructor(private cpu: CPU, debug: Debug) {
        this.cpu.preExecuteHooks.push((_, offset) => {
            if (!debug.CPUPaused && this.breakpoints.includes(offset) && !this.skipNextBreakpoint) {
                debug.CPUPaused = true;
                this.skipNextBreakpoint = true;
                return true;
            }
            this.skipNextBreakpoint = false;
            return false;
        });

        this.initMemoryTable();
        this.initInputs();
    }

    initInputs(): void {
        GOTO_INPUT.addEventListener("keydown", (ev: KeyboardEvent) => {
            if (ev.key === "Enter") {
                let targetAddress = getValueFromString(this.cpu, GOTO_INPUT.value);
                if (ev.shiftKey) {
                    this.cpu.jump(targetAddress);
                } else {
                    this.selectedPosition = targetAddress;
                }
            } 
        });

        SET_VALUE_INPUT.addEventListener("keydown", (ev: KeyboardEvent) => {
            FOLLOW_PC.checked = false;

            let preventDefault = true;
            if (ev.key === "ArrowLeft" || (ev.key === "Tab" && ev.shiftKey)) {
                this.selectedPosition--;
            } else if (ev.key === "ArrowRight" || ev.key === "Tab") {
                this.selectedPosition++;
            } else if (ev.key === "ArrowUp") {
                this.selectedPosition -= COLUMN_COUNT;
            } else if (ev.key === "ArrowDown") {
                this.selectedPosition += COLUMN_COUNT;
            } else if (ev.key === "Enter") {
                this.cpu.pointer8(this.selectedPosition).setUint(getValueFromString(this.cpu, SET_VALUE_INPUT.value));
                if (ev.shiftKey) {
                    this.selectedPosition--;
                } else if (!ev.ctrlKey) {
                    this.selectedPosition++;
                }
            } else {
                preventDefault = false;
            }

            if (preventDefault) {
                ev.preventDefault();
            }
        });

        CANVAS.addEventListener("mousedown", (ev: MouseEvent) => {
            this.draggingScrollbar = true;
            FOLLOW_PC.checked = false;
            this.scrollTo(ev);
            ev.preventDefault();
        });
        CANVAS.addEventListener("mousemove", (ev: MouseEvent) => {
            if (!this.draggingScrollbar) {
                return;
            }

            this.scrollTo(ev);
        });
        CANVAS.addEventListener("mouseup", (ev: MouseEvent) => {
            this.draggingScrollbar = false;
        });
        CANVAS.addEventListener("mouseleave", (ev: MouseEvent) => {
            this.draggingScrollbar = false;
        });
    }

    scrollTo(ev: MouseEvent) {
        // TODO: Also allow dragging outside of the scrollbar
        const scrollPercentage = ev.offsetY / CANVAS.height;
        this.rowOffset = Math.floor(scrollPercentage * MAX_ROW_OFFSET);
    }

    initMemoryTable(): void {
        for (let row = 0; row < ROW_COUNT; row++) {
            const tableRow = TABLE.insertRow();
            for (let col = 0; col < COLUMN_COUNT + 1; col++) {
                const tableCell = tableRow.insertCell();
                if (col === 0) {
                    // Address index
                    tableCell.innerHTML = "$----";
                } else {
                    // Memory values
                    tableCell.innerHTML = "--";
                    tableCell.addEventListener('click', (ev) => {
                        this.clickCell(ev, row, col - 1);
                    });
                }
            }
        }

        TABLE.addEventListener('wheel', (ev) => {
            FOLLOW_PC.checked = false;

            if (ev.deltaY > 0) {
                // Scroll down
                this.rowOffset += ROW_COUNT / 2;
            } else {
                // Scroll up
                this.rowOffset -= ROW_COUNT / 2;
            }
        });
    }

    // scroll
    // follow pc
    updateMemoryTable(): void {
        const pcValue = this.cpu.registers.pc.getUint();
        const instruction = this.cpu.getInstruction(pcValue);
        const instructionOpcodeLength = instruction.opCodes.length;
        const instructionArgLength = getInstructionArgLength(instruction.instruction?.name);
        if (FOLLOW_PC.checked) {
            this.rowOffset = Math.floor(pcValue / COLUMN_COUNT) - Math.floor(ROW_COUNT / 2);
        }
        
        // TODO: blatoy :)
        //  - update css classes (selection?)
        const startAddress = this.rowOffset * COLUMN_COUNT;
        const length = COLUMN_COUNT * ROW_COUNT;
        const memoryChunk = this.cpu.memory.uint8Array.slice(startAddress, startAddress + length);

        for (let viewRow = 0; viewRow < ROW_COUNT; viewRow++) {
            const tableRow = this.rows[viewRow];
            const memoryRow = viewRow + this.rowOffset;

            for (let viewCol = 0; viewCol < COLUMN_COUNT + 1; viewCol++) {
                const tableData = tableRow.children[viewCol] as HTMLTableDataCellElement;
                const viewAddress = viewRow * COLUMN_COUNT + viewCol - 1;
                const memoryAddress = memoryRow * COLUMN_COUNT + viewCol - 1;

                if (viewCol === 0) {
                    // Address index
                    tableData.innerText = toHex(memoryRow * COLUMN_COUNT, 2, '$');
                } else {
                    const endOfOpcode = pcValue + instructionOpcodeLength;

                    // Memory values
                    if (memoryAddress >= pcValue && memoryAddress < endOfOpcode) {
                        tableData.classList.add("pc-address");
                    } else {
                        tableData.classList.remove("pc-address");
                    }

                    // Instruction arguments
                    if (memoryAddress >= endOfOpcode && memoryAddress < endOfOpcode + instructionArgLength) {
                        tableData.classList.add("instruction-parameters");
                    } else {
                        tableData.classList.remove("instruction-parameters");
                    }

                    // Breakpoints
                    if (this.breakpoints.includes(memoryAddress)) {
                        tableData.classList.add("break-point");
                    } else {
                        tableData.classList.remove("break-point");
                    }

                    // Selected position
                    if (this.selectedPosition === memoryAddress) {
                        tableData.classList.add("memory-selected");
                    } else {
                        tableData.classList.remove("memory-selected");
                    }

                    tableData.innerText = toHex(memoryChunk[viewAddress], 1, '');
                }
            }
        }

        PC_ADDRESS.innerHTML = toHex(pcValue, 2, '$');
        OPCODE_AT_PC.innerHTML = instruction.instruction?.name || '???';
    }

    clickCell(event: MouseEvent, row: number, column: number): void {
        event.preventDefault();
        FOLLOW_PC.checked = false;

        // Convert "relative to absolute" coordinates
        const absRow = row + this.rowOffset;
        const position = absRow * COLUMN_COUNT + column;

        if (event.shiftKey) {
            // Set PC
            this.cpu.jump(position);
        } else if (event.ctrlKey) {
            // Toggle breakpoint
            const bpIdx = this.breakpoints.indexOf(position)
            if (bpIdx < 0) {
                this.breakpoints.push(position);
            } else {
                this.breakpoints.splice(bpIdx, 1);
            }
        } else {
            // Select position
            this.selectedPosition = position;
            SET_VALUE_INPUT.focus();
            SET_VALUE_INPUT.value = "";
        }
    }

    renderScrollbar(): void {
        CANVAS.height = CANVAS.clientHeight;

        CTX.fillStyle = "black";
        CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
        
        CTX.globalAlpha = 0.5;
        CTX.fillStyle = "white";

        const scrollHeight = CANVAS.height / 10;
        const scrollPercentage = this.rowOffset / MAX_ROW_OFFSET;
        CTX.fillRect(0, scrollPercentage * Math.max(0, CANVAS.height - scrollHeight), CANVAS.width, scrollHeight);
        CTX.globalAlpha = 1;
        
        const pcScrollPercentage = this.cpu.registers.pc.getUint() / MEMORY_SIZE;
        const pcScrollHeight = 3;
        CTX.fillStyle = "red";
        CTX.fillRect(0, pcScrollPercentage * Math.max(0, CANVAS.height - pcScrollHeight), CANVAS.width, pcScrollHeight);

    }
}

function getInstructionArgLength(instruction: string | undefined): number {
    if (instruction === undefined) {
        return 0;
    }

    return (instruction.match(/[ard]8/g)?.length || 0) + (instruction.match(/[ard]16/g)?.length || 0) * 2
}
