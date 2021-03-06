import { CPU } from "../cpu.js";
import { Instruction } from "../instruction.js";

const pushCodes: Instruction[] = [
    {
        code: 0xC5,
        name: 'PUSH bc',
        execute: (cpu: CPU) => {
            cpu.stackPush(cpu.registers.bc);
            return { machineCycles: 4 };
        }
    },
    {
        code: 0xD5,
        name: 'PUSH de',
        execute: (cpu: CPU) => {
            cpu.stackPush(cpu.registers.de);
            return { machineCycles: 4 };
        }
    },
    {
        code: 0xE5,
        name: 'PUSH hl',
        execute: (cpu: CPU) => {
            cpu.stackPush(cpu.registers.hl);
            return { machineCycles: 4 };
        }
    },
    {
        code: 0xF5,
        name: 'PUSH af',
        execute: (cpu: CPU) => {
            cpu.stackPush(cpu.registers.af);
            return { machineCycles: 4 };
        }
    }
];

export default pushCodes;
