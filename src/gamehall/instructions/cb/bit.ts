import { getBit } from "../../../binch/utils.js";
import { CPU } from "../../cpu.js";
import { Instruction, InstructionExecuteOutput } from "../../instruction.js";
import { Pointer8 } from "../../pointer.js";

/** Copy bit n of r into z. */
function bit(cpu: CPU, value: Pointer8, index: number, clockCycles = 2): InstructionExecuteOutput {
    if (getBit(value.getUint(), index)) {
        cpu.flags.z.clear();
    } else {
        cpu.flags.z.set();
    }
    cpu.flags.n.clear();
    cpu.flags.h.set();

    return { clockCycles };
}

const bitCodes: Instruction[] = [
    {
        code: 0x47,
        name: 'BIT 0,a',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.a, 0)
    },
    {
        code: 0x40,
        name: 'BIT 0,b',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.b, 0)
    },
    {
        code: 0x41,
        name: 'BIT 0,c',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.c, 0)
    },
    {
        code: 0x42,
        name: 'BIT 0,d',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.d, 0)
    },
    {
        code: 0x43,
        name: 'BIT 0,e',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.e, 0)
    },
    {
        code: 0x44,
        name: 'BIT 0,h',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.h, 0)
    },
    {
        code: 0x45,
        name: 'BIT 0,l',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.l, 0)
    },
    {
        code: 0x46,
        name: 'BIT 0,(hl)',
        execute: (cpu: CPU) => bit(cpu, cpu.pointerHL8(), 0, 4)
    },
    {
        code: 0x4F,
        name: 'BIT 1,a',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.a, 1)
    },
    {
        code: 0x48,
        name: 'BIT 1,b',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.b, 1)
    },
    {
        code: 0x49,
        name: 'BIT 1,c',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.c, 1)
    },
    {
        code: 0x4A,
        name: 'BIT 1,d',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.d, 1)
    },
    {
        code: 0x4B,
        name: 'BIT 1,e',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.e, 1)
    },
    {
        code: 0x4C,
        name: 'BIT 1,h',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.h, 1)
    },
    {
        code: 0x4D,
        name: 'BIT 1,l',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.l, 1)
    },
    {
        code: 0x4E,
        name: 'BIT 1,(hl)',
        execute: (cpu: CPU) => bit(cpu, cpu.pointerHL8(), 1, 4)
    },
    {
        code: 0x57,
        name: 'BIT 2,a',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.a, 2)
    },
    {
        code: 0x50,
        name: 'BIT 2,b',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.b, 2)
    },
    {
        code: 0x51,
        name: 'BIT 2,c',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.c, 2)
    },
    {
        code: 0x52,
        name: 'BIT 2,d',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.d, 2)
    },
    {
        code: 0x53,
        name: 'BIT 2,e',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.e, 2)
    },
    {
        code: 0x54,
        name: 'BIT 2,h',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.h, 2)
    },
    {
        code: 0x55,
        name: 'BIT 2,l',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.l, 2)
    },
    {
        code: 0x56,
        name: 'BIT 2,(hl)',
        execute: (cpu: CPU) => bit(cpu, cpu.pointerHL8(), 2, 4)
    },
    {
        code: 0x5F,
        name: 'BIT 3,a',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.a, 3)
    },
    {
        code: 0x58,
        name: 'BIT 3,b',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.b, 3)
    },
    {
        code: 0x59,
        name: 'BIT 3,c',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.c, 3)
    },
    {
        code: 0x5A,
        name: 'BIT 3,d',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.d, 3)
    },
    {
        code: 0x5B,
        name: 'BIT 3,e',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.e, 3)
    },
    {
        code: 0x5C,
        name: 'BIT 3,h',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.h, 3)
    },
    {
        code: 0x5D,
        name: 'BIT 3,l',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.l, 3)
    },
    {
        code: 0x5E,
        name: 'BIT 3,(hl)',
        execute: (cpu: CPU) => bit(cpu, cpu.pointerHL8(), 3, 4)
    },
    {
        code: 0x67,
        name: 'BIT 4,a',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.a, 4)
    },
    {
        code: 0x60,
        name: 'BIT 4,b',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.b, 4)
    },
    {
        code: 0x61,
        name: 'BIT 4,c',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.c, 4)
    },
    {
        code: 0x62,
        name: 'BIT 4,d',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.d, 4)
    },
    {
        code: 0x63,
        name: 'BIT 4,e',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.e, 4)
    },
    {
        code: 0x64,
        name: 'BIT 4,h',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.h, 4)
    },
    {
        code: 0x65,
        name: 'BIT 4,l',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.l, 4)
    },
    {
        code: 0x66,
        name: 'BIT 4,(hl)',
        execute: (cpu: CPU) => bit(cpu, cpu.pointerHL8(), 4, 4)
    },
    {
        code: 0x6F,
        name: 'BIT 5,a',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.a, 5)
    },
    {
        code: 0x68,
        name: 'BIT 5,b',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.b, 5)
    },
    {
        code: 0x69,
        name: 'BIT 5,c',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.c, 5)
    },
    {
        code: 0x6A,
        name: 'BIT 5,d',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.d, 5)
    },
    {
        code: 0x6B,
        name: 'BIT 5,e',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.e, 5)
    },
    {
        code: 0x6C,
        name: 'BIT 5,h',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.h, 5)
    },
    {
        code: 0x6D,
        name: 'BIT 5,l',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.l, 5)
    },
    {
        code: 0x6E,
        name: 'BIT 5,(hl)',
        execute: (cpu: CPU) => bit(cpu, cpu.pointerHL8(), 5, 4)
    },
    {
        code: 0x77,
        name: 'BIT 6,a',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.a, 6)
    },
    {
        code: 0x70,
        name: 'BIT 6,b',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.b, 6)
    },
    {
        code: 0x71,
        name: 'BIT 6,c',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.c, 6)
    },
    {
        code: 0x72,
        name: 'BIT 6,d',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.d, 6)
    },
    {
        code: 0x73,
        name: 'BIT 6,e',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.e, 6)
    },
    {
        code: 0x74,
        name: 'BIT 6,h',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.h, 6)
    },
    {
        code: 0x75,
        name: 'BIT 6,l',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.l, 6)
    },
    {
        code: 0x76,
        name: 'BIT 6,(hl)',
        execute: (cpu: CPU) => bit(cpu, cpu.pointerHL8(), 6, 4)
    },
    {
        code: 0x7F,
        name: 'BIT 7,a',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.a, 7)
    },
    {
        code: 0x78,
        name: 'BIT 7,b',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.b, 7)
    },
    {
        code: 0x79,
        name: 'BIT 7,c',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.c, 7)
    },
    {
        code: 0x7A,
        name: 'BIT 7,d',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.d, 7)
    },
    {
        code: 0x7B,
        name: 'BIT 7,e',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.e, 7)
    },
    {
        code: 0x7C,
        name: 'BIT 7,h',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.h, 7)
    },
    {
        code: 0x7D,
        name: 'BIT 7,l',
        execute: (cpu: CPU) => bit(cpu, cpu.registers.l, 7)
    },
    {
        code: 0x7E,
        name: 'BIT 7,(hl)',
        execute: (cpu: CPU) => bit(cpu, cpu.pointerHL8(), 7, 4)
    }
];

export default bitCodes;
