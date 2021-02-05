import { CPU } from "../cpu.js";
import { NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0xC1,
        name: 'POP bc',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xD1,
        name: 'POP de',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xE1,
        name: 'POP hl',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xF1,
        name: 'POP af',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
];