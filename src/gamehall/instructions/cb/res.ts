import { CPU } from "../../cpu.js";
import { InstructionDefinition, InstructionExecuteOutput, NotImplementedError } from "../../instruction.js";
import { Pointer8 } from "../../pointer.js";

function resetBit(value: Pointer8, bitOffset: number, clockCycles = 2) : InstructionExecuteOutput {
    value.clearBit(bitOffset);
    return { clockCycles };
}

export default [
    {
        code: 0x80,
        name: 'RES 0,b',
        execute: (cpu: CPU) => resetBit(cpu.registers.b, 0)
    },
    {
        code: 0x81,
        name: 'RES 0,c',
        execute: (cpu: CPU) => resetBit(cpu.registers.c, 0)
    },
    {
        code: 0x82,
        name: 'RES 0,d',
        execute: (cpu: CPU) => resetBit(cpu.registers.d, 0)
    },
    {
        code: 0x83,
        name: 'RES 0,e',
        execute: (cpu: CPU) => resetBit(cpu.registers.e, 0)
    },
    {
        code: 0x84,
        name: 'RES 0,h',
        execute: (cpu: CPU) => resetBit(cpu.registers.h, 0)
    },
    {
        code: 0x85,
        name: 'RES 0,l',
        execute: (cpu: CPU) => resetBit(cpu.registers.l, 0)
    },
    {
        code: 0x86,
        name: 'RES 0,(hl)',
        execute: (cpu: CPU) => resetBit(cpu.pointerHL8(), 0, 4)
    },
    {
        code: 0x87,
        name: 'RES 0,a',
        execute: (cpu: CPU) => resetBit(cpu.registers.a, 0)
    },
    {
        code: 0x88,
        name: 'RES 1,b',
        execute: (cpu: CPU) => resetBit(cpu.registers.b, 1)
    },
    {
        code: 0x89,
        name: 'RES 1,c',
        execute: (cpu: CPU) => resetBit(cpu.registers.c, 1)
    },
    {
        code: 0x8A,
        name: 'RES 1,d',
        execute: (cpu: CPU) => resetBit(cpu.registers.d, 1)
    },
    {
        code: 0x8B,
        name: 'RES 1,e',
        execute: (cpu: CPU) => resetBit(cpu.registers.e, 1)
    },
    {
        code: 0x8C,
        name: 'RES 1,h',
        execute: (cpu: CPU) => resetBit(cpu.registers.h, 1)
    },
    {
        code: 0x8D,
        name: 'RES 1,l',
        execute: (cpu: CPU) => resetBit(cpu.registers.l, 1)
    },
    {
        code: 0x8E,
        name: 'RES 1,(hl)',
        execute: (cpu: CPU) => resetBit(cpu.pointerHL8(), 1, 4)
    },
    {
        code: 0x8F,
        name: 'RES 1,a',
        execute: (cpu: CPU) => resetBit(cpu.registers.a, 1)
    },
    {
        code: 0x90,
        name: 'RES 2,b',
        execute: (cpu: CPU) => resetBit(cpu.registers.b, 2)
    },
    {
        code: 0x91,
        name: 'RES 2,c',
        execute: (cpu: CPU) => resetBit(cpu.registers.c, 2)
    },
    {
        code: 0x92,
        name: 'RES 2,d',
        execute: (cpu: CPU) => resetBit(cpu.registers.d, 2)
    },
    {
        code: 0x93,
        name: 'RES 2,e',
        execute: (cpu: CPU) => resetBit(cpu.registers.e, 2)
    },
    {
        code: 0x94,
        name: 'RES 2,h',
        execute: (cpu: CPU) => resetBit(cpu.registers.h, 2)
    },
    {
        code: 0x95,
        name: 'RES 2,l',
        execute: (cpu: CPU) => resetBit(cpu.registers.l, 2)
    },
    {
        code: 0x96,
        name: 'RES 2,(hl)',
        execute: (cpu: CPU) => resetBit(cpu.pointerHL8(), 2, 4)
    },
    {
        code: 0x97,
        name: 'RES 2,a',
        execute: (cpu: CPU) => resetBit(cpu.registers.a, 2)
    },
    {
        code: 0x98,
        name: 'RES 3,b',
        execute: (cpu: CPU) => resetBit(cpu.registers.b, 3)
    },
    {
        code: 0x99,
        name: 'RES 3,c',
        execute: (cpu: CPU) => resetBit(cpu.registers.c, 3)
    },
    {
        code: 0x9A,
        name: 'RES 3,d',
        execute: (cpu: CPU) => resetBit(cpu.registers.d, 3)
    },
    {
        code: 0x9B,
        name: 'RES 3,e',
        execute: (cpu: CPU) => resetBit(cpu.registers.e, 3)
    },
    {
        code: 0x9C,
        name: 'RES 3,h',
        execute: (cpu: CPU) => resetBit(cpu.registers.h, 3)
    },
    {
        code: 0x9D,
        name: 'RES 3,l',
        execute: (cpu: CPU) => resetBit(cpu.registers.l, 3)
    },
    {
        code: 0x9E,
        name: 'RES 3,(hl)',
        execute: (cpu: CPU) => resetBit(cpu.pointerHL8(), 3, 4)
    },
    {
        code: 0x9F,
        name: 'RES 3,a',
        execute: (cpu: CPU) => resetBit(cpu.registers.a, 3)
    },
    {
        code: 0xA0,
        name: 'RES 4,b',
        execute: (cpu: CPU) => resetBit(cpu.registers.b, 4)
    },
    {
        code: 0xA1,
        name: 'RES 4,c',
        execute: (cpu: CPU) => resetBit(cpu.registers.c, 4)
    },
    {
        code: 0xA2,
        name: 'RES 4,d',
        execute: (cpu: CPU) => resetBit(cpu.registers.d, 4)
    },
    {
        code: 0xA3,
        name: 'RES 4,e',
        execute: (cpu: CPU) => resetBit(cpu.registers.e, 4)
    },
    {
        code: 0xA4,
        name: 'RES 4,h',
        execute: (cpu: CPU) => resetBit(cpu.registers.h, 4)
    },
    {
        code: 0xA5,
        name: 'RES 4,l',
        execute: (cpu: CPU) => resetBit(cpu.registers.l, 4)
    },
    {
        code: 0xA6,
        name: 'RES 4,(hl)',
        execute: (cpu: CPU) => resetBit(cpu.pointerHL8(), 4, 4)
    },
    {
        code: 0xA7,
        name: 'RES 4,a',
        execute: (cpu: CPU) => resetBit(cpu.registers.a, 4)
    },
    {
        code: 0xA8,
        name: 'RES 5,b',
        execute: (cpu: CPU) => resetBit(cpu.registers.b, 5)
    },
    {
        code: 0xA9,
        name: 'RES 5,c',
        execute: (cpu: CPU) => resetBit(cpu.registers.c, 5)
    },
    {
        code: 0xAA,
        name: 'RES 5,d',
        execute: (cpu: CPU) => resetBit(cpu.registers.d, 5)
    },
    {
        code: 0xAB,
        name: 'RES 5,e',
        execute: (cpu: CPU) => resetBit(cpu.registers.e, 5)
    },
    {
        code: 0xAC,
        name: 'RES 5,h',
        execute: (cpu: CPU) => resetBit(cpu.registers.h, 5)
    },
    {
        code: 0xAD,
        name: 'RES 5,l',
        execute: (cpu: CPU) => resetBit(cpu.registers.l, 5)
    },
    {
        code: 0xAE,
        name: 'RES 5,(hl)',
        execute: (cpu: CPU) => resetBit(cpu.pointerHL8(), 5, 4)
    },
    {
        code: 0xAF,
        name: 'RES 5,a',
        execute: (cpu: CPU) => resetBit(cpu.registers.a, 5)
    },
    {
        code: 0xB0,
        name: 'RES 6,b',
        execute: (cpu: CPU) => resetBit(cpu.registers.b, 6)
    },
    {
        code: 0xB1,
        name: 'RES 6,c',
        execute: (cpu: CPU) => resetBit(cpu.registers.c, 6)
    },
    {
        code: 0xB2,
        name: 'RES 6,d',
        execute: (cpu: CPU) => resetBit(cpu.registers.d, 6)
    },
    {
        code: 0xB3,
        name: 'RES 6,e',
        execute: (cpu: CPU) => resetBit(cpu.registers.e, 6)
    },
    {
        code: 0xB4,
        name: 'RES 6,h',
        execute: (cpu: CPU) => resetBit(cpu.registers.h, 6)
    },
    {
        code: 0xB5,
        name: 'RES 6,l',
        execute: (cpu: CPU) => resetBit(cpu.registers.l, 6)
    },
    {
        code: 0xB6,
        name: 'RES 6,(hl)',
        execute: (cpu: CPU) => resetBit(cpu.pointerHL8(), 6, 4)
    },
    {
        code: 0xB7,
        name: 'RES 6,a',
        execute: (cpu: CPU) => resetBit(cpu.registers.a, 6)
    },
    {
        code: 0xB8,
        name: 'RES 7,b',
        execute: (cpu: CPU) => resetBit(cpu.registers.b, 7)
    },
    {
        code: 0xB9,
        name: 'RES 7,c',
        execute: (cpu: CPU) => resetBit(cpu.registers.c, 7)
    },
    {
        code: 0xBA,
        name: 'RES 7,d',
        execute: (cpu: CPU) => resetBit(cpu.registers.d, 7)
    },
    {
        code: 0xBB,
        name: 'RES 7,e',
        execute: (cpu: CPU) => resetBit(cpu.registers.e, 7)
    },
    {
        code: 0xBC,
        name: 'RES 7,h',
        execute: (cpu: CPU) => resetBit(cpu.registers.h, 7)
    },
    {
        code: 0xBD,
        name: 'RES 7,l',
        execute: (cpu: CPU) => resetBit(cpu.registers.l, 7)
    },
    {
        code: 0xBE,
        name: 'RES 7,(hl)',
        execute: (cpu: CPU) => resetBit(cpu.pointerHL8(), 7, 4)
    },
    {
        code: 0xBF,
        name: 'RES 7,a',
        execute: (cpu: CPU) => resetBit(cpu.registers.a, 7)
    } 
] as InstructionDefinition[];