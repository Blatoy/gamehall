import { CPU } from "../cpu.js";
import { Instruction, InstructionExecuteOutput, NotImplementedError } from "../instruction.js";
import { Pointer16, Pointer8 } from "../pointer.js";

/** Add r to A. */
function add(cpu: CPU, value: Pointer8, clockCycles = 1): InstructionExecuteOutput {
    const a = cpu.registers.a;
    const v1 = a.getUint();
    const v2 = value.getUint();
    a.setUint(v1 + v2);
    cpu.flags.z.compute(a);
    cpu.flags.n.clear();    
    cpu.flags.c.setValue(v1 + v2 > 255);
    cpu.flags.h.setValue(((v1 & 0xF) + (v2 & 0xF)) & 0x10);
    return { clockCycles };
}

/** Add r to A. */
function add16(cpu: CPU, value: Pointer16, clockCycles = 2): InstructionExecuteOutput {
    const hl = cpu.registers.hl;
    const v1 = hl.getUint();
    const v2 = value.getUint();

    // TODO: Check if endianness is an issue here (it should not but...)
    hl.setUint(v1 + v2);

    cpu.flags.n.clear();

    // TODO: Check flags are computed properly
    cpu.flags.c.setValue(v1 + v2 > 0xFFFF);
    cpu.flags.h.setValue(((v1 & 0xFFF) + (v2 & 0xFFF)) & 0x1000);
    return { clockCycles };
}

const addCodes: Instruction[] = [
    {
        code: 0x09,
        name: 'ADD hl,bc',
        execute: (cpu: CPU) => add16(cpu, cpu.registers.bc)
    },
    {
        code: 0x19,
        name: 'ADD hl,de',
        execute: (cpu: CPU) => add16(cpu, cpu.registers.de)
    },
    {
        code: 0x29,
        name: 'ADD hl,hl',
        execute: (cpu: CPU) => add16(cpu, cpu.registers.hl)
    },
    {
        code: 0x39,
        name: 'ADD hl,sp',
        execute: (cpu: CPU) => add16(cpu, cpu.registers.sp)
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
        name: 'ADD sp,r8', // ADD: h = (sp & 0xF) + (value & 0xF) > 0xF
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
];

export default addCodes;
