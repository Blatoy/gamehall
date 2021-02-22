import { CPU } from "../cpu.js";
import { Instruction, InstructionExecuteOutput } from "../instruction.js";
import { Pointer8 } from "../pointer.js";

/** Execute OR between A and r */
function or(cpu: CPU, value: Pointer8, machineCycles = 1): InstructionExecuteOutput {
    const a = cpu.registers.a;
    a.setUint(a.getUint() | value.getUint());
    cpu.flags.reset();
    cpu.flags.z.compute(a);

    return { machineCycles };
}

const orCodes: Instruction[] = [
    {
        code: 0xB7,
        name: 'OR a,a',
        execute: (cpu: CPU) => or(cpu, cpu.registers.a)
    },
    {
        code: 0xB0,
        name: 'OR a,b',
        execute: (cpu: CPU) => or(cpu, cpu.registers.b)
    },
    {
        code: 0xB1,
        name: 'OR a,c',
        execute: (cpu: CPU) => or(cpu, cpu.registers.c)
    },
    {
        code: 0xB2,
        name: 'OR a,d',
        execute: (cpu: CPU) => or(cpu, cpu.registers.d)
    },
    {
        code: 0xB3,
        name: 'OR a,e',
        execute: (cpu: CPU) => or(cpu, cpu.registers.e)
    },
    {
        code: 0xB4,
        name: 'OR a,h',
        execute: (cpu: CPU) => or(cpu, cpu.registers.h)
    },
    {
        code: 0xB5,
        name: 'OR a,l',
        execute: (cpu: CPU) => or(cpu, cpu.registers.l)
    },
    {
        code: 0xB6,
        name: 'OR a,(hl)',
        execute: (cpu: CPU) => or(cpu, cpu.pointerHL8(), 2)
    },
    {
        code: 0xF6,
        name: 'OR a,d8',
        execute: (cpu: CPU) => or(cpu, cpu.next8(), 2)
    }
];

export default orCodes;
