import { CPU } from "../cpu.js";
import { Instruction, InstructionExecuteOutput } from "../instruction.js";

const jumpAbsoluteCodes: Instruction[] = [
    {
        code: 0xC2,
        name: 'JP nz,a16',
        execute: (cpu: CPU) => {
            const next = cpu.next16();
            if (cpu.flags.z.get() === false) {
                cpu.jump(next.getUint());
                return { clockCycles: 4 };
            }
            return { clockCycles: 3 };
        }
    },
    {
        code: 0xC3,
        name: 'JP a16',
        execute: (cpu: CPU) => {
            // TODO: Endianness for all a16 jumps - The second byte of the object code (immediately following the opcode) corresponds to the
            // lower-order byte of a16 (bits 0-7), and the third byte of the object code corresponds to the higher-order byte (bits 8-15).
            cpu.jump(cpu.next16().getUint());
            return { clockCycles: 4 };
        }
    },
    {
        code: 0xCA,
        name: 'JP z,a16',
        execute: (cpu: CPU) => {
            const next = cpu.next16();
            if (cpu.flags.z.get() === true) {
                cpu.jump(next.getUint());
                return { clockCycles: 4 };
            }
            return { clockCycles: 3 };
        }
    },
    {
        code: 0xD2,
        name: 'JP nc,a16',
        execute: (cpu: CPU) => {
            const next = cpu.next16();
            if (cpu.flags.c.get() === false) {
                cpu.jump(next.getUint());
                return { clockCycles: 4 };
            }
            return { clockCycles: 3 };
        }
    },
    {
        code: 0xDA,
        name: 'JP c,a16',
        execute: (cpu: CPU) => {
            const next = cpu.next16();
            if (cpu.flags.c.get() === true) {
                cpu.jump(next.getUint());
                return { clockCycles: 4 };
            }
            return { clockCycles: 3 };
        }
    },
    {
        code: 0xE9,
        name: 'JP (hl)',
        execute: (cpu: CPU) => {
            // TODO: Endianness ;)
            cpu.jump(cpu.pointerHL16().getUint());
            return { clockCycles: 1 };
        }
    }
];

const jumpRelativeCodes: Instruction[] = [
    {
        code: 0x18,
        name: 'JR r8',
        execute: (cpu: CPU) => {
            cpu.jump(cpu.next8().getInt(), true);
            return { clockCycles: 3 };
        }
    },
    {
        code: 0x20,
        name: 'JR nz,r8',
        execute: (cpu: CPU) => {
            const next = cpu.next8();
            if (cpu.flags.z.get() === false) {
                cpu.jump(next.getInt(), true);
                return { clockCycles: 3 };
            }
            return { clockCycles: 2 };
        }
    },
    {
        code: 0x28,
        name: 'JR z,r8',
        execute: (cpu: CPU) => {
            const next = cpu.next8();
            if (cpu.flags.z.get() === true) {
                cpu.jump(next.getInt(), true);
                return { clockCycles: 3 };
            }
            return { clockCycles: 2 };
        }
    },
    {
        code: 0x30,
        name: 'JR nc,r8',
        execute: (cpu: CPU) => {
            const next = cpu.next8();
            if (cpu.flags.c.get() === false) {
                cpu.jump(next.getInt(), true);
                return { clockCycles: 3 };
            }
            return { clockCycles: 2 };
        }
    },
    {
        code: 0x38,
        name: 'JR c,r8',
        execute: (cpu: CPU) => {
            const next = cpu.next8();
            if (cpu.flags.c.get() === true) {
                cpu.jump(next.getInt(), true);
                return { clockCycles: 3 };
            }
            return { clockCycles: 2 };
        }
    }
];

function rstJump(cpu: CPU, address: number): InstructionExecuteOutput {
    cpu.stackPush(cpu.registers.pc);
    cpu.jump(address);
    return { clockCycles: 4 };
}

const restartCodes: Instruction[] = [
    {
        code: 0xC7,
        name: 'RST 0x00',
        execute: (cpu: CPU) => rstJump(cpu, 0x00)
    },
    {
        code: 0xCF,
        name: 'RST 0x08',
        execute: (cpu: CPU) => rstJump(cpu, 0x08)
    },
    {
        code: 0xD7,
        name: 'RST 0x10',
        execute: (cpu: CPU) => rstJump(cpu, 0x10)
    },
    {
        code: 0xDF,
        name: 'RST 0x18',
        execute: (cpu: CPU) => rstJump(cpu, 0x18)
    },
    {
        code: 0xE7,
        name: 'RST 0x20',
        execute: (cpu: CPU) => rstJump(cpu, 0x20)
    },
    {
        code: 0xEF,
        name: 'RST 0x28',
        execute: (cpu: CPU) => rstJump(cpu, 0x28)
    },
    {
        code: 0xF7,
        name: 'RST 0x30',
        execute: (cpu: CPU) => rstJump(cpu, 0x30)
    },
    {
        code: 0xFF,
        name: 'RST 0x38',
        execute: (cpu: CPU) => rstJump(cpu, 0x38)
    }
];

export default [
    ...jumpAbsoluteCodes,
    ...jumpRelativeCodes,
    ...restartCodes
];
