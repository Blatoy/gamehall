import { CPU } from "../cpu.js";
import { NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0xB0,
        name: 'OR b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xB1,
        name: 'OR c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xB2,
        name: 'OR d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xB3,
        name: 'OR e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xB4,
        name: 'OR h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xB5,
        name: 'OR l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xB6,
        name: 'OR (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xB7,
        name: 'OR a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xF6,
        name: 'OR d8',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
];