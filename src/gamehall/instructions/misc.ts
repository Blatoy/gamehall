import { CPU } from "../cpu.js";
import { Instruction, NotImplementedError } from "../instruction.js";

const miscCodes: Instruction[] = [
    {
        name: 'NOP',
        comment: 'Wastes a machine cycle.',
        code: 0x00,
        execute: () => ({ machineCycles: 1 })
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
        execute: (cpu: CPU) => {
            cpu.interruptMasterEnableFlag = false;
            return { machineCycles: 1 };
        }
    },
    {
        name: 'EI',
        comment: 'Set the interrupt master enable (IME) flag and enable maskable interrupts. This instruction can be used in an interrupt routine to enable higher-order interrupts',
        code: 0xFB,
        execute: (cpu: CPU) => {
            cpu.setInterruptMasterEnableFlagAfterNextInstruction = true;
            return { machineCycles: 1 };
        }
    },
    {
        name: 'DAA',
        comment: 'Adjust the accumulator (register A) to a binary-coded decimal (BCD) number after BCD addition and subtraction operations',
        code: 0x27,
        execute: (cpu: CPU) => {
            // Based on: https://forums.nesdev.com/viewtopic.php?t=15944
            if (cpu.flags.n.get()) {
                // Subtraction (adjust if half-carry or carry occurred)
                if (cpu.flags.c.get()) {
                    cpu.registers.a.setUint(cpu.registers.a.getUint() - 0x60);
                }
                if (cpu.flags.h.get()) {
                    cpu.registers.a.setUint(cpu.registers.a.getUint() - 0x6);
                }
            } else {
                // Addition (adjust if half-carry or carry occurred, or if result is out of bounds)
                if (cpu.flags.c.get() || cpu.registers.a.getUint() > 0x99) {
                    cpu.registers.a.setUint(cpu.registers.a.getUint() + 0x60);
                    cpu.flags.c.set();
                }
                if (cpu.flags.h.get() || ((cpu.registers.a.getUint() & 0x0f) > 0x09)) {
                    cpu.registers.a.setUint(cpu.registers.a.getUint() + 0x6);
                }
            }
            cpu.flags.z.compute(cpu.registers.a);
            cpu.flags.h.clear();
            return { machineCycles: 1 };
        }
    },
    {
        name: 'SCF',
        comment: 'Sets the carry flag [- 0 0 1]',
        code: 0x37,
        execute: (cpu: CPU) => {
            const zero = cpu.flags.z ? 1 : 0;
            cpu.registers.f.setUint(0b0001_0000 | (zero << 7));
            return { machineCycles: 1 };
        }
    },
    {
        name: 'CPL',
        comment: 'Flips all bits of register a',
        code: 0x2F,
        execute: (cpu: CPU) => {
            cpu.registers.a.setUint(~cpu.registers.a.getUint());
            cpu.flags.n.set();
            cpu.flags.h.set();
            return { machineCycles: 1 };
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
            return { machineCycles: 1 };
        }
    }
];

export default miscCodes;
