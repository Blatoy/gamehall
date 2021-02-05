import { CPU } from "../cpu.js";
import { NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0x90,
        name: 'SUB b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x91,
        name: 'SUB c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x92,
        name: 'SUB d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x93,
        name: 'SUB e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x94,
        name: 'SUB h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x95,
        name: 'SUB l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x96,
        name: 'SUB (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x97,
        name: 'SUB a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xD6,
        name: 'SUB d8',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
];