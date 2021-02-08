import { CPU } from "../cpu.js";
import { InstructionDefinition, NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0xC4,
        name: 'CALL nz,a16',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xCC,
        name: 'CALL z,a16',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xCD,
        name: 'CALL a16',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xD4,
        name: 'CALL nc,a16',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xDC,
        name: 'CALL c,a16',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
] as InstructionDefinition[];