import { getBit } from "../../../binch/utils.js";
import { CPU } from "../../cpu.js";
import { Instruction, InstructionExecuteOutput } from "../../instruction.js";
import { Pointer8 } from "../../pointer.js";

/** Rotate left. */
function rl(cpu: CPU, register: Pointer8, clockCycles = 2): InstructionExecuteOutput {
    const carry = cpu.flags.c.get();
    const value = register.getUint();
    cpu.flags.reset();
    cpu.flags.z.compute(value);
    cpu.flags.c.setValue(getBit(value, 7));
    register.setUint(((value & 0b0111_1111) << 1) | (carry ? 0b0000_0001 : 0));

    return { clockCycles };
}

/** Rotate right. */
function rr(cpu: CPU, register: Pointer8, clockCycles = 2): InstructionExecuteOutput {
    const carry = cpu.flags.c.get();
    const value = register.getUint();
    cpu.flags.reset();
    cpu.flags.z.compute(value);
    cpu.flags.c.setValue(getBit(value, 0));
    register.setUint(((value & 0b1111_1110) >> 1) | (carry ? 0b1000_0000 : 0));

    return { clockCycles };
}

const rotateCodes: Instruction[] = [
    /* Rotate left */
    {
        code: 0x17,
        name: 'RL a',
        execute: (cpu: CPU) => rl(cpu, cpu.registers.a)
    },
    {
        code: 0x10,
        name: 'RL b',
        execute: (cpu: CPU) => rl(cpu, cpu.registers.b)
    },
    {
        code: 0x11,
        name: 'RL c',
        execute: (cpu: CPU) => rl(cpu, cpu.registers.c)
    },
    {
        code: 0x12,
        name: 'RL d',
        execute: (cpu: CPU) => rl(cpu, cpu.registers.d)
    },
    {
        code: 0x13,
        name: 'RL e',
        execute: (cpu: CPU) => rl(cpu, cpu.registers.e)
    },
    {
        code: 0x14,
        name: 'RL h',
        execute: (cpu: CPU) => rl(cpu, cpu.registers.h)
    },
    {
        code: 0x15,
        name: 'RL l',
        execute: (cpu: CPU) => rl(cpu, cpu.registers.l)
    },
    {
        code: 0x16,
        name: 'RL (hl)',
        execute: (cpu: CPU) => rl(cpu, cpu.pointerHL8(), 4)
    },
    /* Rotate right */
    {
        code: 0x1F,
        name: 'RR a',
        execute: (cpu: CPU) => rr(cpu, cpu.registers.a)
    },
    {
        code: 0x18,
        name: 'RR b',
        execute: (cpu: CPU) => rr(cpu, cpu.registers.b)
    },
    {
        code: 0x19,
        name: 'RR c',
        execute: (cpu: CPU) => rr(cpu, cpu.registers.c)
    },
    {
        code: 0x1A,
        name: 'RR d',
        execute: (cpu: CPU) => rr(cpu, cpu.registers.d)
    },
    {
        code: 0x1B,
        name: 'RR e',
        execute: (cpu: CPU) => rr(cpu, cpu.registers.e)
    },
    {
        code: 0x1C,
        name: 'RR h',
        execute: (cpu: CPU) => rr(cpu, cpu.registers.h)
    },
    {
        code: 0x1D,
        name: 'RR l',
        execute: (cpu: CPU) => rr(cpu, cpu.registers.l)
    },
    {
        code: 0x1E,
        name: 'RR (hl)',
        execute: (cpu: CPU) => rr(cpu, cpu.pointerHL8(), 4)
    }
];

export default rotateCodes;
