import { CPU } from "../cpu.js";
import { Instruction, InstructionExecuteOutput, NotImplementedError } from "../instruction.js";
import { Pointer8 } from "../pointer.js";

/** Add r to A. */
function add(cpu: CPU, value: Pointer8, clockCycles = 1): InstructionExecuteOutput {
    const a = cpu.registers.a;
    a.setUint(a.getUint() + value.getUint());
    cpu.flags.z.compute(a);
    cpu.flags.n.clear();
    // TODO: Compute C and H flags

    return { clockCycles };
}

const addCodes: Instruction[] = [
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
        code: 0x87,
        name: 'ADD a,a',
        execute: (cpu: CPU) => add(cpu, cpu.registers.a)
    },
    {
        code: 0x80,
        name: 'ADD a,b',
        execute: (cpu: CPU) => add(cpu, cpu.registers.b)
    },
    {
        code: 0x81,
        name: 'ADD a,c',
        execute: (cpu: CPU) => add(cpu, cpu.registers.c)
    },
    {
        code: 0x82,
        name: 'ADD a,d',
        execute: (cpu: CPU) => add(cpu, cpu.registers.d)
    },
    {
        code: 0x83,
        name: 'ADD a,e',
        execute: (cpu: CPU) => add(cpu, cpu.registers.e)
    },
    {
        code: 0x84,
        name: 'ADD a,h',
        execute: (cpu: CPU) => add(cpu, cpu.registers.h)
    },
    {
        code: 0x85,
        name: 'ADD a,l',
        execute: (cpu: CPU) => add(cpu, cpu.registers.l)
    },
    {
        code: 0x86,
        name: 'ADD a,(hl)',
        execute: (cpu: CPU) => add(cpu, cpu.pointerHL8(), 2)
    },
    {
        code: 0xC6,
        name: 'ADD a,d8',
        execute: (cpu: CPU) => add(cpu, cpu.next8(), 2)
    },
    {
        code: 0xE8,
        name: 'ADD sp,r8',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
];

export default addCodes;
