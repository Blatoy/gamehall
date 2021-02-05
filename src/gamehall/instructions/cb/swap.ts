import { CPU } from "../../cpu.js";
import { NotImplementedError } from "../../instruction.js";

export default [
    {
        code: 0x30,
        name: 'SWAP b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x31,
        name: 'SWAP c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x32,
        name: 'SWAP d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x33,
        name: 'SWAP e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x34,
        name: 'SWAP h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x35,
        name: 'SWAP l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x36,
        name: 'SWAP (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x37,
        name: 'SWAP a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
];