import { CPU } from "../cpu.js";
import { InstructionDefinition, NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0x17,
        name: 'RLA',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x07,
        name: 'RLCA',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x1F,
        name: 'RRA',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x0F,
        name: 'RRCA',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
] as InstructionDefinition[];