import { CPU } from "../cpu.js";
import { InstructionDefinition, NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0x03,
        name: 'INC bc',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x04,
        name: 'INC b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x0C,
        name: 'INC c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x13,
        name: 'INC de',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x14,
        name: 'INC d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x1C,
        name: 'INC e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x23,
        name: 'INC hl',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x24,
        name: 'INC h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x2C,
        name: 'INC l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x33,
        name: 'INC sp',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x34,
        name: 'INC (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x3C,
        name: 'INC a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
] as InstructionDefinition[];