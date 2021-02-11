import { CPU } from "../cpu.js";
import { Instruction, InstructionExecuteOutput } from "../instruction.js";
import { Pointer8 } from "../pointer.js";

/** Execute AND between A and r */
function and(cpu: CPU, value: Pointer8, clockCycles = 1): InstructionExecuteOutput {
    const a = cpu.registers.a;
    a.setUint(a.getUint() & value.getUint());
    cpu.flags.reset();
    cpu.flags.z.compute(a);
    cpu.flags.h.set();

    return { clockCycles };
}

const andCodes: Instruction[] = [
    {
        code: 0xA7,
        name: 'AND a,a',
        execute: (cpu: CPU) => and(cpu, cpu.registers.a)
    },
    {
        code: 0xA0,
        name: 'AND a,b',
        execute: (cpu: CPU) => and(cpu, cpu.registers.b)
    },
    {
        code: 0xA1,
        name: 'AND a,c',
        execute: (cpu: CPU) => and(cpu, cpu.registers.c)
    },
    {
        code: 0xA2,
        name: 'AND a,d',
        execute: (cpu: CPU) => and(cpu, cpu.registers.d)
    },
    {
        code: 0xA3,
        name: 'AND a,e',
        execute: (cpu: CPU) => and(cpu, cpu.registers.e)
    },
    {
        code: 0xA4,
        name: 'AND a,h',
        execute: (cpu: CPU) => and(cpu, cpu.registers.h)
    },
    {
        code: 0xA5,
        name: 'AND a,l',
        execute: (cpu: CPU) => and(cpu, cpu.registers.l)
    },
    {
        code: 0xA6,
        name: 'AND a,(hl)',
        execute: (cpu: CPU) => and(cpu, cpu.pointerHL8(), 2)
    },
    {
        code: 0xE6,
        name: 'AND a,d8',
        execute: (cpu: CPU) => and(cpu, cpu.next8(), 2)
    }
];

export default andCodes;
