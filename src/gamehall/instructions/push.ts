import { CPU } from "../cpu.js";
import { Instruction } from "../instruction.js";

const pushCodes: Instruction[] = [
    {
        code: 0xC5,
        name: 'PUSH bc',
        execute: (cpu: CPU) => {
            cpu.stackPush(cpu.registers.bc);
            return { clockCycles: 4 };
        }
    },
    {
        code: 0xD5,
        name: 'PUSH de',
        execute: (cpu: CPU) => {
            cpu.stackPush(cpu.registers.de);
            return { clockCycles: 4 };
        }
    },
    {
        code: 0xE5,
        name: 'PUSH hl',
        execute: (cpu: CPU) => {
            cpu.stackPush(cpu.registers.hl);
            return { clockCycles: 4 };
        }
    },
    {
        code: 0xF5,
        name: 'PUSH af',
        execute: (cpu: CPU) => {
            cpu.stackPush(cpu.registers.af);
            return { clockCycles: 4 };
        }
    }
];

export default pushCodes;
