import { CPU } from "../../cpu.js";
import { Instruction, InstructionExecuteOutput } from "../../instruction.js";
import { Pointer8 } from "../../pointer.js";

function swap(cpu: CPU, value: Pointer8, clockCycles = 2): InstructionExecuteOutput {
    const high = 0b1111_0000 & value.getUint();
    value.setUint((value.getUint() << 4) | (high >> 4));
    cpu.flags.reset();
    cpu.flags.z.setValue(value.getUint() === 0);

    return { clockCycles };
}

const swapCodes: Instruction[] = [
    {
        code: 0x37,
        name: 'SWAP a',
        execute: (cpu: CPU) => swap(cpu, cpu.registers.a)
    },
    {
        code: 0x30,
        name: 'SWAP b',
        execute: (cpu: CPU) => swap(cpu, cpu.registers.b)
    },
    {
        code: 0x31,
        name: 'SWAP c',
        execute: (cpu: CPU) => swap(cpu, cpu.registers.c)
    },
    {
        code: 0x32,
        name: 'SWAP d',
        execute: (cpu: CPU) => swap(cpu, cpu.registers.d)
    },
    {
        code: 0x33,
        name: 'SWAP e',
        execute: (cpu: CPU) => swap(cpu, cpu.registers.e)
    },
    {
        code: 0x34,
        name: 'SWAP h',
        execute: (cpu: CPU) => swap(cpu, cpu.registers.h)
    },
    {
        code: 0x35,
        name: 'SWAP l',
        execute: (cpu: CPU) => swap(cpu, cpu.registers.l)
    },
    {
        code: 0x36,
        name: 'SWAP (hl)',
        execute: (cpu: CPU) => swap(cpu, cpu.pointerHL8(), 4)
    }
];

export default swapCodes;
