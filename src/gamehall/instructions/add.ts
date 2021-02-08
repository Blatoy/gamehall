import { CPU } from "../cpu.js";
import { InstructionDefinition, NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0x09,
        name: 'ADD hl,bc',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x19,
        name: 'ADD hl,de',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x29,
        name: 'ADD hl,hl',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x39,
        name: 'ADD hl,sp',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x80,
        name: 'ADD a,b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x81,
        name: 'ADD a,c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x82,
        name: 'ADD a,d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x83,
        name: 'ADD a,e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x84,
        name: 'ADD a,h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x85,
        name: 'ADD a,l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x86,
        name: 'ADD a,(hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x87,
        name: 'ADD a,a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xC6,
        name: 'ADD a,d8',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xE8,
        name: 'ADD sp,r8',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
] as InstructionDefinition[];