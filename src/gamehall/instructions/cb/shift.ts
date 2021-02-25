import { getBit } from "../../../binch/utils.js";
import { CPU } from "../../cpu.js";
import { InstructionDefinition, InstructionExecuteOutput, NotImplementedError } from "../../instruction.js";
import { Pointer8 } from "../../pointer.js";

/** Shift left. */
function shiftLeft(cpu: CPU, register: Pointer8, machineCycles = 2): InstructionExecuteOutput {
    const value = register.getUint();
    cpu.flags.reset();
    cpu.flags.c.setValue(getBit(value, 7));
    register.setUint((value & 0b0111_1111) << 1);
    cpu.flags.z.compute(value);

    return { machineCycles };
}

export default [
    {
        code: 0x20,
        name: 'SLA b',
        execute: (cpu: CPU) => shiftLeft(cpu, cpu.registers.b)
    },
    {
        code: 0x21,
        name: 'SLA c',
        execute: (cpu: CPU) => shiftLeft(cpu, cpu.registers.c)
    },
    {
        code: 0x22,
        name: 'SLA d',
        execute: (cpu: CPU) => shiftLeft(cpu, cpu.registers.d)
    },
    {
        code: 0x23,
        name: 'SLA e',
        execute: (cpu: CPU) => shiftLeft(cpu, cpu.registers.e)
    },
    {
        code: 0x24,
        name: 'SLA h',
        execute: (cpu: CPU) => shiftLeft(cpu, cpu.registers.h)
    },
    {
        code: 0x25,
        name: 'SLA l',
        execute: (cpu: CPU) => shiftLeft(cpu, cpu.registers.l)
    },
    {
        code: 0x26,
        name: 'SLA (hl)',
        execute: (cpu: CPU) => shiftLeft(cpu, cpu.pointerHL8(), 4)
    },
    {
        code: 0x27,
        name: 'SLA a',
        execute: (cpu: CPU) => shiftLeft(cpu, cpu.registers.a)
    },
    /** Shift right (keep bit 0*/
    {
        code: 0x28,
        name: 'SRA b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x29,
        name: 'SRA c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x2A,
        name: 'SRA d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x2B,
        name: 'SRA e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x2C,
        name: 'SRA h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x2D,
        name: 'SRA l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x2E,
        name: 'SRA (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x2F,
        name: 'SRA a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    /** Shift Right (reset bit 0) */
    {
        code: 0x38,
        name: 'SRL b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x39,
        name: 'SRL c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x3A,
        name: 'SRL d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x3B,
        name: 'SRL e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x3C,
        name: 'SRL h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x3D,
        name: 'SRL l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x3E,
        name: 'SRL (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x3F,
        name: 'SRL a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
] as InstructionDefinition[];