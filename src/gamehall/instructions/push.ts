import { CPU } from "../cpu.js";
import { InstructionDefinition, NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0xC5,
        name: 'PUSH bc',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xD5,
        name: 'PUSH de',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xE5,
        name: 'PUSH hl',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xF5,
        name: 'PUSH af',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
] as InstructionDefinition[];