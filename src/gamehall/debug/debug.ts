import { CPU } from "../cpu.js";
import { hotkeyListeners } from "../hotkeys.js";
import { ROM } from "../rom.js";
import { toBinary, toHex } from "../utils.js";
import { LastInstructions } from "./last-instructions.js";
import { MemoryEditor } from "./memory-editor.js";
import { updateMemoryViewCanvas } from "./memory-view.js";
import { updateFlags, updateRegisters } from "./registers.js";
import { Speed } from "./speed.js";
import { updateStack } from "./stack.js";

const CYCLE_DISPLAY_BUTTON = document.getElementById("cycle-binary-view") as HTMLButtonElement;
const STEP_BUTTON = document.getElementById("step") as HTMLButtonElement;
const PAUSE_CONTINUE_BUTTON = document.getElementById("pause-continue") as HTMLButtonElement;
const PAUSE_CONTINUE_IMAGE = document.getElementById("play-pause-img") as HTMLImageElement;
const RESET_BUTTON = document.getElementById("reset-rom") as HTMLButtonElement;

export class Debug {
    memoryEditor: MemoryEditor;
    lastInstructions: LastInstructions;
    speed: Speed;

    private _activeDisplayType = DisplayType.Binary;
    get activeDisplayType(): DisplayType {
        return this._activeDisplayType;
    }

    set activeDisplayType(value: DisplayType) {
        this._activeDisplayType = value;
        CYCLE_DISPLAY_BUTTON.querySelector('label')!.innerText = DisplayType[this.activeDisplayType];
    }

    CPUPaused = true;

    constructor(public cpu: CPU) {
        this.memoryEditor = new MemoryEditor(cpu, this);
        this.lastInstructions = new LastInstructions(this);
        this.speed = new Speed(cpu);

        CYCLE_DISPLAY_BUTTON.addEventListener("click", () => {
            this.cycleDisplayType();
        });

        STEP_BUTTON.addEventListener("click", () => {
            this.step();
        });

        PAUSE_CONTINUE_BUTTON.addEventListener("click", () => {
            this.togglePaused();
        });

        RESET_BUTTON.addEventListener("click", () => {
            this.resetROM();
        });
    }

    addHotkeyListener() {
        hotkeyListeners.push((hotkey) => {
            switch (hotkey) {
                case 'step':
                    this.step();
                    break;
                case 'pause':
                    this.togglePaused();
                    break;
                case 'display-type-binary':
                    this.activeDisplayType = DisplayType.Binary;
                    break;
                case 'display-type-hex':
                    this.activeDisplayType = DisplayType.Hex;
                    break;
                case 'display-type-decimal':
                    this.activeDisplayType = DisplayType.Decimal;
                    break;
                case 'reset-rom':
                    this.resetROM();
                    break;
            }
        });
    }
    
    async resetROM() {
        // TODO: Make reset more exhaustive later
        this.cpu.reset();
        this.cpu.memory.init();
        this.lastInstructions.reset();

        const bootROM = await ROM.load('boot-rom.gb');
        this.cpu.memory.write(0, new Uint8Array(bootROM));
    }

    step() {
        this.setCPUPaused(true);
        this.cpu.executeInstruction();
    }

    togglePaused() {
        this.setCPUPaused(!this.CPUPaused);
    }

    setCPUPaused(paused: boolean) {
        // TODO: Toggle the icon
        this.CPUPaused = paused;
        if (paused) {
            PAUSE_CONTINUE_IMAGE.src = "./icons/play.svg";
        }
        else {
            PAUSE_CONTINUE_IMAGE.src = "./icons/pause.svg";
        }
    }

    afterTick(): void {
        updateRegisters(this.cpu, this.activeDisplayType);
        updateFlags(this.cpu);
        updateStack(this.cpu, this.activeDisplayType);
        updateMemoryViewCanvas(this.cpu);

        this.lastInstructions.updateDOMTable();
        this.memoryEditor.updateMemoryTable();
        this.memoryEditor.renderScrollbar();
    }

    cycleDisplayType(): DisplayType {
        this.activeDisplayType++;

        if (this.activeDisplayType === DisplayType._MAX) {
            this.activeDisplayType = 0;
        }

        return this.activeDisplayType;
    }
}

export function getValueFromString(cpu: CPU, value: string): number {
    if (value.startsWith("#")) {
        return parseInt(value.substring(1), 10);
    } else if (value.startsWith("%")) {
        return parseInt(value.substring(1), 2);
    } else if (value.startsWith("0x")) {
        return parseInt(value.substring(2), 16);
    } else if (value.startsWith("$")) {
        return cpu.pointer8(parseInt(value.substring(1), 16)).getUint();
    } else if (value.startsWith("$$")) {
        return cpu.pointer16(parseInt(value.substring(2), 16)).getUint();
    } else {
        return parseInt(value, 16);
    }
}

export function getFormattedValue(value: number, displayType: DisplayType, byteSize = 1): string {
    switch (displayType) {
        case DisplayType.Binary:
            return toBinary(value, byteSize);
        case DisplayType.Hex:
            return toHex(value, byteSize);
        case DisplayType.Decimal:
            return value.toString();
        default:
            throw new Error('Unknown DisplayType ' + displayType);
    }
}

export enum DisplayType {
    Binary,
    Hex,
    Decimal,
    _MAX
}
