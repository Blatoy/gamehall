import { CPU } from "../cpu.js";
import { InstructionDefinition, NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0xC0,
        name: 'RET nz',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xC8,
        name: 'RET z',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xC9,
        name: 'RET',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xD0,
        name: 'RET nc',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xD8,
        name: 'RET c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xD9,
        name: 'RETI',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
] as InstructionDefinition[];