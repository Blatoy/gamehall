import { CPU } from "../cpu.js";
import { DisplayType, getFormattedValue } from "./debug.js";

const REGISTER_TD = 'register-';
const FLAG_TD = 'flag-';

export function updateRegisters(cpu: CPU, displayType: DisplayType): void {
    for (const register of cpu.getRegisterNames()) {
        const registerElement = document.getElementById(REGISTER_TD + register) as HTMLTableDataCellElement | null;
        if (registerElement === null) {
            continue;
        }

        const registerPointer = cpu.registers[register];
        registerElement.innerText = getFormattedValue(registerPointer.getUint(), displayType, registerPointer.byteSize);
    }
}

export function updateFlags(cpu: CPU): void {
    for (const flag of cpu.getFlagNames()) {
        const flagElement = document.getElementById(FLAG_TD + flag) as HTMLTableDataCellElement | null;
        if (flagElement === null) {
            continue;
        }

        const flagValue = cpu.flags[flag].get();

        if (flagValue) {
            flagElement.classList.remove('flag-disabled');
        } else {
            flagElement.classList.add('flag-disabled');
        }

        flagElement.innerText = flagValue ? '1' : '0';
    }
}
