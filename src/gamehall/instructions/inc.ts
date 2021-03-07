import { CPU } from "../cpu.js";
import { Instruction, InstructionExecuteOutput } from "../instruction.js";
import { Pointer16, Pointer8 } from "../pointer.js";

/** Increment r by 1. */
function inc(cpu: CPU, register: Pointer8 | Pointer16, machineCycles = 1): InstructionExecuteOutput {
    const oldValue = register.getUint();
    const newValue = oldValue + 1;
    register.setUint(newValue);
    if (register.byteSize === 1) {
        cpu.flags.z.compute(register);
        cpu.flags.n.clear();
        cpu.flags.h.setValue(((oldValue & 0xF) + 1) & 0x10);
    }

    return { machineCycles };
}

const incCodes: Instruction[] = [
    {
        code: 0x03,
        name: 'INC bc',
        execute: (cpu: CPU) => inc(cpu, cpu.registers.bc, 2)
    },
    {
        code: 0x13,
        name: 'INC de',
        execute: (cpu: CPU) => inc(cpu, cpu.registers.de, 2)
    },
    {
        code: 0x23,
        name: 'INC hl',
        execute: (cpu: CPU) => inc(cpu, cpu.registers.hl, 2)
    },
    {
        code: 0x33,
        name: 'INC sp',
        execute: (cpu: CPU) => inc(cpu, cpu.registers.sp, 2)
    },
    {
        code: 0x3C,
        name: 'INC a',
        execute: (cpu: CPU) => inc(cpu, cpu.registers.a)
    },
    {
        code: 0x04,
        name: 'INC b',
        execute: (cpu: CPU) => inc(cpu, cpu.registers.b)
    },
    {
        code: 0x0C,
        name: 'INC c',
        execute: (cpu: CPU) => inc(cpu, cpu.registers.c)
    },
    {
        code: 0x14,
        name: 'INC d',
        execute: (cpu: CPU) => inc(cpu, cpu.registers.d)
    },
    {
        code: 0x1C,
        name: 'INC e',
        execute: (cpu: CPU) => inc(cpu, cpu.registers.e)
    },
    {
        code: 0x24,
        name: 'INC h',
        execute: (cpu: CPU) => inc(cpu, cpu.registers.h)
    },
    {
        code: 0x2C,
        name: 'INC l',
        execute: (cpu: CPU) => inc(cpu, cpu.registers.l)
    },
    {
        code: 0x34,
        name: 'INC (hl)',
        execute: (cpu: CPU) => inc(cpu, cpu.pointerHL8(), 2)
    }
];

export default incCodes;
