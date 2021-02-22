import { CPU } from "../cpu.js";
import { Pointer8 } from "../pointer.js";
import { Instruction, InstructionExecuteOutput } from "../instruction.js";

/** Execute XOR between A and r */
function xor(cpu: CPU, value: Pointer8, machineCycles = 1): InstructionExecuteOutput {
    const a = cpu.registers.a;
    a.setUint(a.getUint() ^ value.getUint());
    cpu.flags.reset();
    cpu.flags.z.compute(a);

    return { machineCycles };
}

const xorCodes: Instruction[] = [
    {
        code: 0xAF,
        name: 'XOR a,a',
        execute: (cpu: CPU) => xor(cpu, cpu.registers.a)
    } as any,
    {
        code: 0xA8,
        name: 'XOR a,b',
        execute: (cpu: CPU) => xor(cpu, cpu.registers.b)
    },
    {
        code: 0xA9,
        name: 'XOR a,c',
        execute: (cpu: CPU) => xor(cpu, cpu.registers.c)
    },
    {
        code: 0xAA,
        name: 'XOR a,d',
        execute: (cpu: CPU) => xor(cpu, cpu.registers.d)
    },
    {
        code: 0xAB,
        name: 'XOR a,e',
        execute: (cpu: CPU) => xor(cpu, cpu.registers.e)
    },
    {
        code: 0xAC,
        name: 'XOR a,h',
        execute: (cpu: CPU) => xor(cpu, cpu.registers.h)
    },
    {
        code: 0xAD,
        name: 'XOR a,l',
        execute: (cpu: CPU) => xor(cpu, cpu.registers.l)
    },
    {
        code: 0xAE,
        name: 'XOR a,(hl)',
        execute: (cpu: CPU) => xor(cpu, cpu.pointerHL8(), 2)
    },
    {
        code: 0xEE,
        name: 'XOR a,d8',
        execute: (cpu: CPU) => xor(cpu, cpu.next8(), 2)
    }
];

export default xorCodes;
