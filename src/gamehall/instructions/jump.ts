import { CPU } from "../cpu.js";
import { Instruction, NotImplementedError } from "../instruction.js";

const jumpAbsoluteCodes: Instruction[] = [
    {
        code: 0xC2,
        name: 'JP nz,a16',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xC3,
        name: 'JP a16',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xCA,
        name: 'JP z,a16',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xD2,
        name: 'JP nc,a16',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xDA,
        name: 'JP c,a16',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
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

const restartCodes: Instruction[] = [
    
    {
        code: 0xC7,
        name: 'RST 0x00',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xCF,
        name: 'RST 0x08',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xD7,
        name: 'RST 0x10',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xDF,
        name: 'RST 0x18',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xE7,
        name: 'RST 0x20',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xEF,
        name: 'RST 0x28',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xF7,
        name: 'RST 0x30',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0xFF,
        name: 'RST 0x38',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
];

export default [
    ...jumpAbsoluteCodes,
    ...jumpRelativeCodes,
    ...restartCodes
];