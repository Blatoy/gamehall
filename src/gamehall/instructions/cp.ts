import { CPU } from "../cpu.js";
import { NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0xB8,
        name: 'CP b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xB9,
        name: 'CP c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xBA,
        name: 'CP d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xBB,
        name: 'CP e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xBC,
        name: 'CP h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xBD,
        name: 'CP l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xBE,
        name: 'CP (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xBF,
        name: 'CP a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xFE,
        name: 'CP d8',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
];