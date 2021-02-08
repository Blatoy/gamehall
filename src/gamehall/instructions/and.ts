import { CPU } from "../cpu.js";
import { InstructionDefinition, NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0xA0,
        name: 'AND b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xA1,
        name: 'AND c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xA2,
        name: 'AND d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xA3,
        name: 'AND e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xA4,
        name: 'AND h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xA5,
        name: 'AND l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xA6,
        name: 'AND (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xA7,
        name: 'AND a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xE6,
        name: 'AND d8',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
] as InstructionDefinition[];