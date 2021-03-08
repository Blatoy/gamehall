import { CPU } from "../cpu.js";
import { Instruction } from "../instruction.js";

const popCodes: Instruction[] = [
    {
        code: 0xC1,
        name: 'POP bc',
        execute: (cpu: CPU) => {
            const value = cpu.stackPop16();
            cpu.registers.bc.setUint(value.getUint());
            return { machineCycles: 3 };
        }
    },
    {
        code: 0xD1,
        name: 'POP de',
        execute: (cpu: CPU) => {
            const value = cpu.stackPop16();
            cpu.registers.de.setUint(value.getUint());
            return { machineCycles: 3 };
        }
    },
    {
        code: 0xE1,
        name: 'POP hl',
        execute: (cpu: CPU) => {
            const value = cpu.stackPop16();
            cpu.registers.hl.setUint(value.getUint());
            return { machineCycles: 3 };
        }
    },
    {
        code: 0xF1,
        name: 'POP af',
        execute: (cpu: CPU) => {
            const value = cpu.stackPop16();
            cpu.registers.af.setUint(value.getUint() & 0xFFF0);
            return { machineCycles: 3 };
        }
    }
];

export default popCodes;
