import { CPU } from "../cpu.js";
import { NotImplementedError } from "../instruction.js";

export default [
    {
        name: 'NOP',
        comment: 'Wastes a clock cycle.',
        code: 0x00,
        execute: () => ({ clockCycles: 1 })
    },
    {
        name: 'STOP',
        code: 0x10,
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x76,
        name: 'HALT',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        name: 'DI',
        comment: 'Reset the interrupt master enable (IME) flag and prohibit maskable interrupts',
        code: 0xF3,
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        name: 'EI',
        comment: 'Set the interrupt master enable (IME) flag and enable maskable interrupts. This instruction can be used in an interrupt routine to enable higher-order interrupts',
        code: 0xFB,
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        name: 'DAA',
        comment: 'Adjust the accumulator (register A) to a binary-coded decimal (BCD) number after BCD addition and subtraction operations',
        code: 0x27,
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        name: 'SCF',
        comment: 'Sets the carry flag [- 0 0 1]',
        code: 0x37,
        execute: (cpu: CPU) => {
            const zero = cpu.flags.z ? 1 : 0;
            cpu.registers.f.setUint(0b0001_0000 | (zero << 7));
        }
    },
    {
        name: 'CPL',
        comment: 'Flips all bits of register a',
        code: 0x2F,
        execute: (cpu: CPU) => {
            // TODO: Does setUint8(negative number) do it goodly?
            cpu.registers.a.setUint(~cpu.registers.a.getUint());
        }
    },
    {
        name: 'CCF',
        comment: 'Flips the carry flag [- 0 0 !c]',
        code: 0x3F,
        execute: (cpu: CPU) => {
            cpu.flags.n.clear();
            cpu.flags.h.clear();

            if (cpu.flags.c.get()) {
                cpu.flags.c.clear();
            } else {
                cpu.flags.c.set();
            }
        }
    }
];