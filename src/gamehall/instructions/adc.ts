import { CPU } from "../cpu.js";
import { NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0x88,
        name: 'ADC a,b',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x89,
        name: 'ADC a,c',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x8A,
        name: 'ADC a,d',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x8B,
        name: 'ADC a,e',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x8C,
        name: 'ADC a,h',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x8D,
        name: 'ADC a,l',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x8E,
        name: 'ADC a,(hl)',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x8F,
        name: 'ADC a,a',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xCE,
        name: 'ADC a,d8',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
];