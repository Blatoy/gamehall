import { getBit } from "../../../binch/utils.js";
import { CPU } from "../../cpu.js";
import { Instruction, InstructionExecuteOutput } from "../../instruction.js";
import { Pointer8 } from "../../pointer.js";

/** Rotate left. */
function rl(cpu: CPU, register: Pointer8, machineCycles = 2): InstructionExecuteOutput {
    const carry = cpu.flags.c.get();
    const value = register.getUint();

    cpu.flags.reset();
    cpu.flags.c.setValue(getBit(value, 7));
    register.setUint(((value & 0b0111_1111) << 1) | (carry ? 0b0000_0001 : 0));
    cpu.flags.z.compute(register);
    
    return { machineCycles };
}

/** Rotate right. */
function rr(cpu: CPU, register: Pointer8, machineCycles = 2): InstructionExecuteOutput {
    const carry = cpu.flags.c.get();
    const value = register.getUint();

    cpu.flags.reset();
    cpu.flags.c.setValue(getBit(value, 0));
    register.setUint((value >> 1) | (carry ? 0b1000_0000 : 0));
    cpu.flags.z.compute(register);

    return { machineCycles };
}

/** Rotate left carry. */
function rlc(cpu: CPU, register: Pointer8, machineCycles = 2): InstructionExecuteOutput {
    const value = register.getUint();
    const bit7 = getBit(value, 7);

    cpu.flags.reset();
    cpu.flags.c.setValue(bit7);

    register.setUint(((value & 0b0111_1111) << 1) | (bit7 ? 1 : 0));
    cpu.flags.z.compute(register);

    return { machineCycles };
}

/** Rotate right carry. */
function rrc(cpu: CPU, register: Pointer8, machineCycles = 2): InstructionExecuteOutput {
    const value = register.getUint();
    const bit0 = getBit(value, 0);

    cpu.flags.reset();
    cpu.flags.c.setValue(bit0);

    register.setUint((value >> 1) | (bit0 ? 0b1000_0000 : 0));
    cpu.flags.z.compute(register);

    return { machineCycles };
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

const rotateCarryCodes = [
    /* Rotate left carry */
    {
        code: 0x00,
        name: 'RLC b',
        execute: (cpu: CPU) => rlc(cpu, cpu.registers.b)
    },
    {
        code: 0x01,
        name: 'RLC c',
        execute: (cpu: CPU) => rlc(cpu, cpu.registers.c)
    },
    {
        code: 0x02,
        name: 'RLC d',
        execute: (cpu: CPU) => rlc(cpu, cpu.registers.d)
    },
    {
        code: 0x03,
        name: 'RLC e',
        execute: (cpu: CPU) => rlc(cpu, cpu.registers.e)
    },
    {
        code: 0x04,
        name: 'RLC h',
        execute: (cpu: CPU) => rlc(cpu, cpu.registers.h)
    },
    {
        code: 0x05,
        name: 'RLC l',
        execute: (cpu: CPU) => rlc(cpu, cpu.registers.l)
    },
    {
        code: 0x06,
        name: 'RLC (hl)',
        execute: (cpu: CPU) => rlc(cpu, cpu.pointerHL8(), 4)
    },
    {
        code: 0x07,
        name: 'RLC a',
        execute: (cpu: CPU) => rlc(cpu, cpu.registers.a)
    },
    /* Rotate right carry */
    {
        code: 0x08,
        name: 'RRC b',
        execute: (cpu: CPU) => rrc(cpu, cpu.registers.b)
    },
    {
        code: 0x09,
        name: 'RRC c',
        execute: (cpu: CPU) => rrc(cpu, cpu.registers.c)
    },
    {
        code: 0x0A,
        name: 'RRC d',
        execute: (cpu: CPU) => rrc(cpu, cpu.registers.d)
    },
    {
        code: 0x0B,
        name: 'RRC e',
        execute: (cpu: CPU) => rrc(cpu, cpu.registers.e)
    },
    {
        code: 0x0C,
        name: 'RRC h',
        execute: (cpu: CPU) => rrc(cpu, cpu.registers.h)
    },
    {
        code: 0x0D,
        name: 'RRC l',
        execute: (cpu: CPU) => rrc(cpu, cpu.registers.l)
    },
    {
        code: 0x0E,
        name: 'RRC (hl)',
        execute: (cpu: CPU) => rrc(cpu, cpu.pointerHL8(), 4)
    },
    {
        code: 0x0F,
        name: 'RRC a',
        execute: (cpu: CPU) => rrc(cpu, cpu.registers.a)
    }
] as Instruction[];

export default [
    ...rotateCodes,
    ...rotateCarryCodes
];
