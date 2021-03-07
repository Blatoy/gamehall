import { CPU } from "../cpu.js";
import { Instruction, InstructionDefinition, InstructionExecuteOutput } from "../instruction.js";
import { Pointer8 } from "../pointer.js";

/** Subtract r and carry from A. */
function subCarry(cpu: CPU, value: Pointer8, machineCycles = 1): InstructionExecuteOutput {
    const a = cpu.registers.a;
    const carry = cpu.flags.c.getValue();

    const v1 = a.getUint();
    const v2 = value.getUint();

    a.setUint(v1 - v2 - carry);
    cpu.flags.z.compute(a);
    cpu.flags.n.set();
    cpu.flags.c.setValue(v1 - v2 - carry < 0);
    cpu.flags.h.setValue((v1 & 0xF) < (v2 & 0xF) + carry);

    return { machineCycles };
}

const sbcCodes: Instruction[] = [
    {
        code: 0x98,
        name: 'SBC a,b',
        execute: (cpu: CPU) => subCarry(cpu, cpu.registers.b)
    },
    {
        code: 0x99,
        name: 'SBC a,c',
        execute: (cpu: CPU) => subCarry(cpu, cpu.registers.c)
    },
    {
        code: 0x9A,
        name: 'SBC a,d',
        execute: (cpu: CPU) => subCarry(cpu, cpu.registers.d)
    },
    {
        code: 0x9B,
        name: 'SBC a,e',
        execute: (cpu: CPU) => subCarry(cpu, cpu.registers.e)
    },
    {
        code: 0x9C,
        name: 'SBC a,h',
        execute: (cpu: CPU) => subCarry(cpu, cpu.registers.h)
    },
    {
        code: 0x9D,
        name: 'SBC a,l',
        execute: (cpu: CPU) => subCarry(cpu, cpu.registers.l)
    },
    {
        code: 0x9E,
        name: 'SBC a,(hl)',
        execute: (cpu: CPU) => subCarry(cpu, cpu.pointerHL8(), 2)
    },
    {
        code: 0x9F,
        name: 'SBC a,a',
        execute: (cpu: CPU) => subCarry(cpu, cpu.registers.a)
    },
    {
        code: 0xDE,
        name: 'SBC a,d8',
        execute: (cpu: CPU) => subCarry(cpu, cpu.next8(), 2)
    }
];

export default sbcCodes;
