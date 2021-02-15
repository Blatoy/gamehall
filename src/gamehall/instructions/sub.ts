import { CPU } from "../cpu.js";
import { Instruction, InstructionExecuteOutput } from "../instruction.js";
import { Pointer8 } from "../pointer.js";

/** Subtract r from A. */
function sub(cpu: CPU, register: Pointer8, clockCycles = 1): InstructionExecuteOutput {
    const a = cpu.registers.a.getUint();
    const value = register.getUint();
    const delta = a - value;
    cpu.registers.a.setUint(delta);
    cpu.flags.z.compute(delta);
    cpu.flags.n.set();
    cpu.flags.h.setValue((a & 0xF) < (value & 0xF));
    cpu.flags.c.setValue(a < value);

    return { clockCycles };
}

const subCodes: Instruction[] = [
    {
        code: 0x97,
        name: 'SUB a',
        execute: (cpu: CPU) => sub(cpu, cpu.registers.a)
    },
    {
        code: 0x90,
        name: 'SUB b',
        execute: (cpu: CPU) => sub(cpu, cpu.registers.b)
    },
    {
        code: 0x91,
        name: 'SUB c',
        execute: (cpu: CPU) => sub(cpu, cpu.registers.c)
    },
    {
        code: 0x92,
        name: 'SUB d',
        execute: (cpu: CPU) => sub(cpu, cpu.registers.d)
    },
    {
        code: 0x93,
        name: 'SUB e',
        execute: (cpu: CPU) => sub(cpu, cpu.registers.e)
    },
    {
        code: 0x94,
        name: 'SUB h',
        execute: (cpu: CPU) => sub(cpu, cpu.registers.h)
    },
    {
        code: 0x95,
        name: 'SUB l',
        execute: (cpu: CPU) => sub(cpu, cpu.registers.l)
    },
    {
        code: 0x96,
        name: 'SUB (hl)',
        execute: (cpu: CPU) => sub(cpu, cpu.pointerHL8(), 2)
    },
    {
        code: 0xD6,
        name: 'SUB d8',
        execute: (cpu: CPU) => sub(cpu, cpu.next8(), 2)
    }
];

export default subCodes;
