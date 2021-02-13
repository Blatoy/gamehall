import { CPU } from "../cpu.js";
import { Instruction, InstructionExecuteOutput } from "../instruction.js";
import { Pointer8 } from "../pointer.js";

/** Execute CP between A and r */
function cp(cpu: CPU, value: Pointer8, clockCycles = 1): InstructionExecuteOutput {
    const cp = cpu.registers.a.getUint() - value.getUint();
    cpu.flags.z.compute(cp);
    cpu.flags.n.set();
    // TODO: Compute H and C flags

    return { clockCycles };
}

const cpCodes: Instruction[] = [
    {
        code: 0xBF,
        name: 'CP a',
        execute: (cpu: CPU) => cp(cpu, cpu.registers.a)
    },
    {
        code: 0xB8,
        name: 'CP b',
        execute: (cpu: CPU) => cp(cpu, cpu.registers.b)
    },
    {
        code: 0xB9,
        name: 'CP c',
        execute: (cpu: CPU) => cp(cpu, cpu.registers.c)
    },
    {
        code: 0xBA,
        name: 'CP d',
        execute: (cpu: CPU) => cp(cpu, cpu.registers.d)
    },
    {
        code: 0xBB,
        name: 'CP e',
        execute: (cpu: CPU) => cp(cpu, cpu.registers.e)
    },
    {
        code: 0xBC,
        name: 'CP h',
        execute: (cpu: CPU) => cp(cpu, cpu.registers.h)
    },
    {
        code: 0xBD,
        name: 'CP l',
        execute: (cpu: CPU) => cp(cpu, cpu.registers.l)
    },
    {
        code: 0xBE,
        name: 'CP (hl)',
        execute: (cpu: CPU) => cp(cpu, cpu.pointerHL8(), 2)
    },
    {
        code: 0xFE,
        name: 'CP d8',
        execute: (cpu: CPU) => cp(cpu, cpu.next8(), 2)
    }
];

export default cpCodes;
