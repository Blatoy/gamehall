import { CPU } from "../cpu.js";
import { NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0x05,
        name: 'DEC b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x0B,
        name: 'DEC bc',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x0D,
        name: 'DEC c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x15,
        name: 'DEC d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x1B,
        name: 'DEC de',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x1D,
        name: 'DEC e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x25,
        name: 'DEC h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x2B,
        name: 'DEC hl',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x2D,
        name: 'DEC l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x35,
        name: 'DEC (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x3B,
        name: 'DEC sp',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x3D,
        name: 'DEC a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
];