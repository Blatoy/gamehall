import { CPU } from "../cpu.js";
import { InstructionDefinition, InstructionExecuteOutput } from "../instruction.js";
import { Pointer16, Pointer8 } from "../pointer.js";

/** Decrement r by 1. */
function dec(cpu: CPU, register: Pointer8 | Pointer16, clockCycles = 1): InstructionExecuteOutput {
    const oldValue = register.getUint();
    const newValue = oldValue - 1;
    register.setUint(newValue);
    if (register.byteSize === 1) {
        cpu.flags.z.compute(newValue);
        cpu.flags.n.set();
        cpu.flags.h.setValue((oldValue & 0xF) < 1);
    }

    return { clockCycles };
}

export default [
    {
        code: 0x0B,
        name: 'DEC bc',
        execute: (cpu: CPU) => dec(cpu, cpu.registers.bc, 2)
    },
    {
        code: 0x1B,
        name: 'DEC de',
        execute: (cpu: CPU) => dec(cpu, cpu.registers.de, 2)
    },
    {
        code: 0x2B,
        name: 'DEC hl',
        execute: (cpu: CPU) => dec(cpu, cpu.registers.hl, 2)
    },
    {
        code: 0x3B,
        name: 'DEC sp',
        execute: (cpu: CPU) => dec(cpu, cpu.registers.sp, 2)
    },
    {
        code: 0x3D,
        name: 'DEC a',
        execute: (cpu: CPU) => dec(cpu, cpu.registers.a)
    },
    {
        code: 0x05,
        name: 'DEC b',
        execute: (cpu: CPU) => dec(cpu, cpu.registers.b)
    },
    {
        code: 0x0D,
        name: 'DEC c',
        execute: (cpu: CPU) => dec(cpu, cpu.registers.c)
    },
    {
        code: 0x15,
        name: 'DEC d',
        execute: (cpu: CPU) => dec(cpu, cpu.registers.d)
    },
    {
        code: 0x1D,
        name: 'DEC e',
        execute: (cpu: CPU) => dec(cpu, cpu.registers.e)
    },
    {
        code: 0x25,
        name: 'DEC h',
        execute: (cpu: CPU) => dec(cpu, cpu.registers.h)
    },
    {
        code: 0x2D,
        name: 'DEC l',
        execute: (cpu: CPU) => dec(cpu, cpu.registers.l)
    },
    {
        code: 0x35,
        name: 'DEC (hl)',
        execute: (cpu: CPU) => dec(cpu, cpu.pointerHL8())
    }
] as InstructionDefinition[];
