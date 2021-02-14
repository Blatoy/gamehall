import { CPU } from "../cpu.js";
import { Instruction } from "../instruction.js";

const callCodes: Instruction[] = [
    {
        code: 0xC4,
        name: 'CALL nz,a16',
        execute: (cpu: CPU) => {
            const next = cpu.next16().getUint();
            if (cpu.flags.z.get() === false) {
                cpu.stackPush(cpu.registers.pc);
                cpu.jump(next);
                return { clockCycles: 6 };
            }
            return { clockCycles: 3 };
        }
    },
    {
        code: 0xCC,
        name: 'CALL z,a16',
        execute: (cpu: CPU) => {
            const next = cpu.next16().getUint();
            if (cpu.flags.z.get() === true) {
                cpu.stackPush(cpu.registers.pc);
                cpu.jump(next);
                return { clockCycles: 6 };
            }
            return { clockCycles: 3 };
        }
    },
    {
        code: 0xCD,
        name: 'CALL a16',
        execute: (cpu: CPU) => {
            const next = cpu.next16().getUint();
            cpu.stackPush(cpu.registers.pc);
            cpu.jump(next);
            return { clockCycles: 6 };
        }
    },
    {
        code: 0xD4,
        name: 'CALL nc,a16',
        execute: (cpu: CPU) => {
            const next = cpu.next16().getUint();
            if (cpu.flags.c.get() === false) {
                cpu.stackPush(cpu.registers.pc);
                cpu.jump(next);
                return { clockCycles: 6 };
            }
            return { clockCycles: 3 };
        }
    },
    {
        code: 0xDC,
        name: 'CALL c,a16',
        execute: (cpu: CPU) => {
            const next = cpu.next16().getUint();
            if (cpu.flags.c.get() === true) {
                cpu.stackPush(cpu.registers.pc);
                cpu.jump(next);
                return { clockCycles: 6 };
            }
            return { clockCycles: 3 };
        }
    }
];

export default callCodes;
