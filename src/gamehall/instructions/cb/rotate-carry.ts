import { CPU } from "../../cpu.js";
import { InstructionDefinition, NotImplementedError } from "../../instruction.js";

export default [
    {
        code: 0x00,
        name: 'RLC b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x01,
        name: 'RLC c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x02,
        name: 'RLC d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x03,
        name: 'RLC e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x04,
        name: 'RLC h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x05,
        name: 'RLC l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x06,
        name: 'RLC (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x07,
        name: 'RLC a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    /** Rotate right carry */
    {
        code: 0x08,
        name: 'RRC b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x09,
        name: 'RRC c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x0A,
        name: 'RRC d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x0B,
        name: 'RRC e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x0C,
        name: 'RRC h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x0D,
        name: 'RRC l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x0E,
        name: 'RRC (hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x0F,
        name: 'RRC a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
] as InstructionDefinition[];