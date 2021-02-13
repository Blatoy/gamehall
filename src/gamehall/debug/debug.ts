import { toBinary, toHex } from "../utils.js";
import { LastInstructions } from "./last-instructions.js";
import { updateFlags, updateRegisters } from "./registers.js";

export class Debug {
    private lastInstructions: LastInstructions;

    constructor(private cpu: CPU) {
        this.lastInstructions = new LastInstructions(cpu);
    }

    afterTick(): void {
        updateRegisters(this.cpu, this.activeDisplayType);
        updateFlags(this.cpu);

        this.lastInstructions.updateDOMTable();
    }

    cycleDisplayType(): DisplayType {
        this.activeDisplayType++;
        if (this.activeDisplayType === Object.keys(DisplayType).length) {
            this.activeDisplayType = 0;
        }

        return this.activeDisplayType;
    }

    activeDisplayType = DisplayType.Binary;

}

export function getFormattedValue(value: number, displayType: DisplayType, byteSize = 1): string {
    switch (displayType) {
        case DisplayType.Binary:
            return toBinary(value, byteSize);
        case DisplayType.Hex:
            return toHex(value, byteSize);
        case DisplayType.Decimal:
            return value.toString();
    }
}

export enum DisplayType {
    Binary,
    Hex,
    Decimal
}
