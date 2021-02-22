import { CPU } from "../cpu.js";
import { Instruction, InstructionExecuteOutput } from "../instruction.js";
import { Pointer8 } from "../pointer.js";

/** Add r and carry to A. */
function addCarry(cpu: CPU, value: Pointer8): InstructionExecuteOutput {
    const a = cpu.registers.a;
    const carry = cpu.flags.c.getValue();

    const v1 = a.getUint();
    const v2 = value.getUint();

    a.setUint(v1 + v2 + carry);
    cpu.flags.z.compute(a);
    cpu.flags.n.clear();    
    cpu.flags.c.setValue(v1 + v2 + carry > 255);
    cpu.flags.h.setValue(((v1 & 0xF) + (v2 & 0xF) + carry) & 0x10);
    return { machineCycles: 2 };
}

const adcCodes: Instruction[] = [
    {
        code: 0x88,
        name: 'ADC a,b',
        execute: (cpu: CPU) => addCarry(cpu, cpu.registers.b)
    },
    {
        code: 0x89,
        name: 'ADC a,c',
        execute: (cpu: CPU) => addCarry(cpu, cpu.registers.c)
    },
    {
        code: 0x8A,
        name: 'ADC a,d',
        execute: (cpu: CPU) => addCarry(cpu, cpu.registers.d)
    },
    {
        code: 0x8B,
        name: 'ADC a,e',
        execute: (cpu: CPU) => addCarry(cpu, cpu.registers.e)
    },
    {
        code: 0x8C,
        name: 'ADC a,h',
        execute: (cpu: CPU) => addCarry(cpu, cpu.registers.h)
    },
    {
        code: 0x8D,
        name: 'ADC a,l',
        execute: (cpu: CPU) => addCarry(cpu, cpu.registers.l)
    },
    {
        code: 0x8E,
        name: 'ADC a,(hl)',
        execute: (cpu: CPU) => addCarry(cpu, cpu.pointerHL8())
    },
    {
        code: 0x8F,
        name: 'ADC a,a',
        execute: (cpu: CPU) => addCarry(cpu, cpu.registers.a)
    },
    {
        code: 0xCE,
        name: 'ADC a,d8',
        execute: (cpu: CPU) => addCarry(cpu, cpu.next8())
    }
];

export default adcCodes;
