import { CPU } from "../../cpu.js";
import { InstructionDefinition, InstructionExecuteOutput, NotImplementedError } from "../../instruction.js";
import { Pointer8 } from "../../pointer.js";

/** Set bit n of register to 1 */
function setBit(cpu: CPU, value: Pointer8, index: number, machineCycles = 2): InstructionExecuteOutput {
    value.setBit(index);
    return { machineCycles };
}

export default [
    {
        code: 0xC0,
        name: 'SET 0,b',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.b, 0)
    },
    {
        code: 0xC1,
        name: 'SET 0,c',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.c, 0)
    },
    {
        code: 0xC2,
        name: 'SET 0,d',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.d, 0)
    },
    {
        code: 0xC3,
        name: 'SET 0,e',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.e, 0)
    },
    {
        code: 0xC4,
        name: 'SET 0,h',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.h, 0)
    },
    {
        code: 0xC5,
        name: 'SET 0,l',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.l, 0)
    },
    {
        code: 0xC6,
        name: 'SET 0,(hl)',
        execute: (cpu: CPU) => setBit(cpu, cpu.pointerHL8(), 0, 4)
    },
    {
        code: 0xC7,
        name: 'SET 0,a',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.a, 0)
    },
    {
        code: 0xC8,
        name: 'SET 1,b',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.b, 1)
    },
    {
        code: 0xC9,
        name: 'SET 1,c',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.c, 1)
    },
    {
        code: 0xCA,
        name: 'SET 1,d',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.d, 1)
    },
    {
        code: 0xCB,
        name: 'SET 1,e',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.e, 1)
    },
    {
        code: 0xCC,
        name: 'SET 1,h',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.h, 1)
    },
    {
        code: 0xCD,
        name: 'SET 1,l',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.l, 1)
    },
    {
        code: 0xCE,
        name: 'SET 1,(hl)',
        execute: (cpu: CPU) => setBit(cpu, cpu.pointerHL8(), 1, 4)
    },
    {
        code: 0xCF,
        name: 'SET 1,a',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.a, 1)
    },
    {
        code: 0xD0,
        name: 'SET 2,b',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.b, 2)
    },
    {
        code: 0xD1,
        name: 'SET 2,c',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.c, 2)
    },
    {
        code: 0xD2,
        name: 'SET 2,d',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.d, 2)
    },
    {
        code: 0xD3,
        name: 'SET 2,e',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.e, 2)
    },
    {
        code: 0xD4,
        name: 'SET 2,h',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.h, 2)
    },
    {
        code: 0xD5,
        name: 'SET 2,l',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.l, 2)
    },
    {
        code: 0xD6,
        name: 'SET 2,(hl)',
        execute: (cpu: CPU) => setBit(cpu, cpu.pointerHL8(), 2, 4)
    },
    {
        code: 0xD7,
        name: 'SET 2,a',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.a, 2)
    },
    {
        code: 0xD8,
        name: 'SET 3,b',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.b, 3)
    },
    {
        code: 0xD9,
        name: 'SET 3,c',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.c, 3)
    },
    {
        code: 0xDA,
        name: 'SET 3,d',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.d, 3)
    },
    {
        code: 0xDB,
        name: 'SET 3,e',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.e, 3)
    },
    {
        code: 0xDC,
        name: 'SET 3,h',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.h, 3)
    },
    {
        code: 0xDD,
        name: 'SET 3,l',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.l, 3)
    },
    {
        code: 0xDE,
        name: 'SET 3,(hl)',
        execute: (cpu: CPU) => setBit(cpu, cpu.pointerHL8(), 3, 4)
    },
    {
        code: 0xDF,
        name: 'SET 3,a',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.a, 3)
    },
    {
        code: 0xE0,
        name: 'SET 4,b',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.b, 4)
    },
    {
        code: 0xE1,
        name: 'SET 4,c',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.c, 4)
    },
    {
        code: 0xE2,
        name: 'SET 4,d',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.d, 4)
    },
    {
        code: 0xE3,
        name: 'SET 4,e',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.e, 4)
    },
    {
        code: 0xE4,
        name: 'SET 4,h',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.h, 4)
    },
    {
        code: 0xE5,
        name: 'SET 4,l',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.l, 4)
    },
    {
        code: 0xE6,
        name: 'SET 4,(hl)',
        execute: (cpu: CPU) => setBit(cpu, cpu.pointerHL8(), 4, 4)
    },
    {
        code: 0xE7,
        name: 'SET 4,a',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.a, 4)
    },
    {
        code: 0xE8,
        name: 'SET 5,b',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.b, 5)
    },
    {
        code: 0xE9,
        name: 'SET 5,c',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.c, 5)
    },
    {
        code: 0xEA,
        name: 'SET 5,d',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.d, 5)
    },
    {
        code: 0xEB,
        name: 'SET 5,e',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.e, 5)
    },
    {
        code: 0xEC,
        name: 'SET 5,h',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.h, 5)
    },
    {
        code: 0xED,
        name: 'SET 5,l',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.l, 5)
    },
    {
        code: 0xEE,
        name: 'SET 5,(hl)',
        execute: (cpu: CPU) => setBit(cpu, cpu.pointerHL8(), 5, 4)
    },
    {
        code: 0xEF,
        name: 'SET 5,a',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.a, 5)
    },
    {
        code: 0xF0,
        name: 'SET 6,b',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.b, 6)
    },
    {
        code: 0xF1,
        name: 'SET 6,c',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.c, 6)
    },
    {
        code: 0xF2,
        name: 'SET 6,d',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.d, 6)
    },
    {
        code: 0xF3,
        name: 'SET 6,e',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.e, 6)
    },
    {
        code: 0xF4,
        name: 'SET 6,h',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.h, 6)
    },
    {
        code: 0xF5,
        name: 'SET 6,l',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.l, 6)
    },
    {
        code: 0xF6,
        name: 'SET 6,(hl)',
        execute: (cpu: CPU) => setBit(cpu, cpu.pointerHL8(), 6, 4)
    },
    {
        code: 0xF7,
        name: 'SET 6,a',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.a, 6)
    },
    {
        code: 0xF8,
        name: 'SET 7,b',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.b, 7)
    },
    {
        code: 0xF9,
        name: 'SET 7,c',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.c, 7)
    },
    {
        code: 0xFA,
        name: 'SET 7,d',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.d, 7)
    },
    {
        code: 0xFB,
        name: 'SET 7,e',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.e, 7)
    },
    {
        code: 0xFC,
        name: 'SET 7,h',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.h, 7)
    },
    {
        code: 0xFD,
        name: 'SET 7,l',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.l, 7)
    },
    {
        code: 0xFE,
        name: 'SET 7,(hl)',
        execute: (cpu: CPU) => setBit(cpu, cpu.pointerHL8(), 7, 4)
    },
    {
        code: 0xFF,
        name: 'SET 7,a',
        execute: (cpu: CPU) => setBit(cpu, cpu.registers.a, 7)
    }
] as InstructionDefinition[];