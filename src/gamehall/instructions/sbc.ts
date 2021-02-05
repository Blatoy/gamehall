import { CPU } from "../cpu.js";
import { NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0x98,
        name: 'SBC a,b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x99,
        name: 'SBC a,c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x9A,
        name: 'SBC a,d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x9B,
        name: 'SBC a,e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x9C,
        name: 'SBC a,h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x9D,
        name: 'SBC a,l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x9E,
        name: 'SBC a,(hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x9F,
        name: 'SBC a,a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xDE,
        name: 'SBC a,d8',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
];