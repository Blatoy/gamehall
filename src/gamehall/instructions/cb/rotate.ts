import { CPU } from "../../cpu.js";
import { InstructionDefinition, NotImplementedError } from "../../instruction.js";

export default [
    {
        code: 0x10,
        name: 'RL b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x11,
        name: 'RL c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x12,
        name: 'RL d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x13,
        name: 'RL e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x14,
        name: 'RL h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x15,
        name: 'RL l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x16,
        name: 'RL (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x17,
        name: 'RL a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    /* Rotate right */
    {
        code: 0x18,
        name: 'RR b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x19,
        name: 'RR c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x1A,
        name: 'RR d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x1B,
        name: 'RR e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x1C,
        name: 'RR h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x1D,
        name: 'RR l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x1E,
        name: 'RR (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x1F,
        name: 'RR a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
] as InstructionDefinition[];