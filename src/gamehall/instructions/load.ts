import { CPU } from "../cpu.js";
import { Pointer16, Pointer8 } from "../pointer.js";
import { Instruction, InstructionExecuteOutput } from "../instruction.js";

/** Load value from r1 into r2 */
function load(cpu: CPU, to: Pointer8 | Pointer16, from: Pointer8 | Pointer16, clockCycles = 1): InstructionExecuteOutput {
    to.setUint(from.getUint());

    return { clockCycles };
}

const uselessLoadCodes: Instruction[] = [
    {
        code: 0x7F,
        name: 'LD a,a',
        execute: () => ({ clockCycles: 1 })
    },
    {
        code: 0x40,
        name: 'LD b,b',
        execute: () => ({ clockCycles: 1 })
    },
    {
        code: 0x49,
        name: 'LD c,c',
        execute: () => ({ clockCycles: 1 })
    },
    {
        code: 0x52,
        name: 'LD d,d',
        execute: () => ({ clockCycles: 1 })
    },
    {
        code: 0x5B,
        name: 'LD e,e',
        execute: () => ({ clockCycles: 1 })
    },
    {
        code: 0x64,
        name: 'LD h,h',
        execute: () => ({ clockCycles: 1 })
    },
    {
        code: 0x6D,
        name: 'LD l,l',
        execute: () => ({ clockCycles: 1 })
    }
];

const load8Codes: Instruction[] = [
    // Load into A
    {
        code: 0x78,
        name: 'LD a,b',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.registers.b)
    },
    {
        code: 0x79,
        name: 'LD a,c',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.registers.c)
    },
    {
        code: 0x7A,
        name: 'LD a,d',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.registers.d)
    },
    {
        code: 0x7B,
        name: 'LD a,e',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.registers.e)
    },
    {
        code: 0x7C,
        name: 'LD a,h',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.registers.h)
    },
    {
        code: 0x7D,
        name: 'LD a,l',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.registers.l)
    },
    {
        code: 0x7E,
        name: 'LD a,(hl)',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.pointerHL8(), 2)
    },
    // Load into B
    {
        code: 0x47,
        name: 'LD b,a',
        execute: (cpu: CPU) => load(cpu, cpu.registers.b, cpu.registers.a)
    },
    {
        code: 0x41,
        name: 'LD b,c',
        execute: (cpu: CPU) => load(cpu, cpu.registers.b, cpu.registers.c)
    },
    {
        code: 0x42,
        name: 'LD b,d',
        execute: (cpu: CPU) => load(cpu, cpu.registers.b, cpu.registers.d)
    },
    {
        code: 0x43,
        name: 'LD b,e',
        execute: (cpu: CPU) => load(cpu, cpu.registers.b, cpu.registers.e)
    },
    {
        code: 0x44,
        name: 'LD b,h',
        execute: (cpu: CPU) => load(cpu, cpu.registers.b, cpu.registers.h)
    },
    {
        code: 0x45,
        name: 'LD b,l',
        execute: (cpu: CPU) => load(cpu, cpu.registers.b, cpu.registers.l)
    },
    {
        code: 0x46,
        name: 'LD b,(hl)',
        execute: (cpu: CPU) => load(cpu, cpu.registers.b, cpu.pointerHL8(), 2)
    },
    // Load into C
    {
        code: 0x4F,
        name: 'LD c,a',
        execute: (cpu: CPU) => load(cpu, cpu.registers.c, cpu.registers.a)
    },
    {
        code: 0x48,
        name: 'LD c,b',
        execute: (cpu: CPU) => load(cpu, cpu.registers.c, cpu.registers.b)
    },
    {
        code: 0x4A,
        name: 'LD c,d',
        execute: (cpu: CPU) => load(cpu, cpu.registers.c, cpu.registers.d)
    },
    {
        code: 0x4B,
        name: 'LD c,e',
        execute: (cpu: CPU) => load(cpu, cpu.registers.c, cpu.registers.e)
    },
    {
        code: 0x4C,
        name: 'LD c,h',
        execute: (cpu: CPU) => load(cpu, cpu.registers.c, cpu.registers.h)
    },
    {
        code: 0x4D,
        name: 'LD c,l',
        execute: (cpu: CPU) => load(cpu, cpu.registers.c, cpu.registers.l)
    },
    {
        code: 0x4E,
        name: 'LD c,(hl)',
        execute: (cpu: CPU) => load(cpu, cpu.registers.c, cpu.pointerHL8(), 2)
    },
    // Load into D
    {
        code: 0x57,
        name: 'LD d,a',
        execute: (cpu: CPU) => load(cpu, cpu.registers.d, cpu.registers.a)
    },
    {
        code: 0x50,
        name: 'LD d,b',
        execute: (cpu: CPU) => load(cpu, cpu.registers.d, cpu.registers.b)
    },
    {
        code: 0x51,
        name: 'LD d,c',
        execute: (cpu: CPU) => load(cpu, cpu.registers.d, cpu.registers.c)
    },
    {
        code: 0x53,
        name: 'LD d,e',
        execute: (cpu: CPU) => load(cpu, cpu.registers.d, cpu.registers.e)
    },
    {
        code: 0x54,
        name: 'LD d,h',
        execute: (cpu: CPU) => load(cpu, cpu.registers.d, cpu.registers.h)
    },
    {
        code: 0x55,
        name: 'LD d,l',
        execute: (cpu: CPU) => load(cpu, cpu.registers.d, cpu.registers.l)
    },
    {
        code: 0x56,
        name: 'LD d,(hl)',
        execute: (cpu: CPU) => load(cpu, cpu.registers.d, cpu.pointerHL8(), 2)
    },
    // Load into E
    {
        code: 0x5F,
        name: 'LD e,a',
        execute: (cpu: CPU) => load(cpu, cpu.registers.e, cpu.registers.a)
    },
    {
        code: 0x58,
        name: 'LD e,b',
        execute: (cpu: CPU) => load(cpu, cpu.registers.e, cpu.registers.b)
    },
    {
        code: 0x59,
        name: 'LD e,c',
        execute: (cpu: CPU) => load(cpu, cpu.registers.e, cpu.registers.c)
    },
    {
        code: 0x5A,
        name: 'LD e,d',
        execute: (cpu: CPU) => load(cpu, cpu.registers.e, cpu.registers.d)
    },
    {
        code: 0x5C,
        name: 'LD e,h',
        execute: (cpu: CPU) => load(cpu, cpu.registers.e, cpu.registers.h)
    },
    {
        code: 0x5D,
        name: 'LD e,l',
        execute: (cpu: CPU) => load(cpu, cpu.registers.e, cpu.registers.l)
    },
    {
        code: 0x5E,
        name: 'LD e,(hl)',
        execute: (cpu: CPU) => load(cpu, cpu.registers.e, cpu.pointerHL8(), 2)
    },
    // Load into h
    {
        code: 0x67,
        name: 'LD h,a',
        execute: (cpu: CPU) => load(cpu, cpu.registers.h, cpu.registers.a)
    },
    {
        code: 0x60,
        name: 'LD h,b',
        execute: (cpu: CPU) => load(cpu, cpu.registers.h, cpu.registers.b)
    },
    {
        code: 0x61,
        name: 'LD h,c',
        execute: (cpu: CPU) => load(cpu, cpu.registers.h, cpu.registers.c)
    },
    {
        code: 0x62,
        name: 'LD h,d',
        execute: (cpu: CPU) => load(cpu, cpu.registers.h, cpu.registers.d)
    },
    {
        code: 0x63,
        name: 'LD h,e',
        execute: (cpu: CPU) => load(cpu, cpu.registers.h, cpu.registers.e)
    },
    {
        code: 0x65,
        name: 'LD h,l',
        execute: (cpu: CPU) => load(cpu, cpu.registers.h, cpu.registers.l)
    },
    {
        code: 0x66,
        name: 'LD h,(hl)',
        execute: (cpu: CPU) => load(cpu, cpu.registers.h, cpu.pointerHL8(), 2)
    },
    // Load into L
    {
        code: 0x6F,
        name: 'LD l,a',
        execute: (cpu: CPU) => load(cpu, cpu.registers.l, cpu.registers.a)
    },
    {
        code: 0x68,
        name: 'LD l,b',
        execute: (cpu: CPU) => load(cpu, cpu.registers.l, cpu.registers.b)
    },
    {
        code: 0x69,
        name: 'LD l,c',
        execute: (cpu: CPU) => load(cpu, cpu.registers.l, cpu.registers.c)
    },
    {
        code: 0x6A,
        name: 'LD l,d',
        execute: (cpu: CPU) => load(cpu, cpu.registers.l, cpu.registers.d)
    },
    {
        code: 0x6B,
        name: 'LD l,e',
        execute: (cpu: CPU) => load(cpu, cpu.registers.l, cpu.registers.e)
    },
    {
        code: 0x6C,
        name: 'LD l,h',
        execute: (cpu: CPU) => load(cpu, cpu.registers.l, cpu.registers.h)
    },
    {
        code: 0x6E,
        name: 'LD l,(hl)',
        execute: (cpu: CPU) => load(cpu, cpu.registers.l, cpu.pointerHL8(), 2)
    },
    // Load into (hl)
    {
        code: 0x77,
        name: 'LD (hl),a',
        execute: (cpu: CPU) => load(cpu, cpu.pointerHL8(), cpu.registers.a, 2)
    },
    {
        code: 0x70,
        name: 'LD (hl),b',
        execute: (cpu: CPU) => load(cpu, cpu.pointerHL8(), cpu.registers.b, 2)
    },
    {
        code: 0x71,
        name: 'LD (hl),c',
        execute: (cpu: CPU) => load(cpu, cpu.pointerHL8(), cpu.registers.c, 2)
    },
    {
        code: 0x72,
        name: 'LD (hl),d',
        execute: (cpu: CPU) => load(cpu, cpu.pointerHL8(), cpu.registers.d, 2)
    },
    {
        code: 0x73,
        name: 'LD (hl),e',
        execute: (cpu: CPU) => load(cpu, cpu.pointerHL8(), cpu.registers.e, 2)
    },
    {
        code: 0x74,
        name: 'LD (hl),h',
        execute: (cpu: CPU) => load(cpu, cpu.pointerHL8(), cpu.registers.h, 2)
    },
    {
        code: 0x75,
        name: 'LD (hl),l',
        execute: (cpu: CPU) => load(cpu, cpu.pointerHL8(), cpu.registers.l, 2)
    },
    // Load from next byte
    {
        code: 0x3E,
        name: 'LD a,d8',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.next8(), 2)
    },
    {
        code: 0x06,
        name: 'LD b,d8',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.next8(), 2)
    },
    {
        code: 0x0E,
        name: 'LD c,d8',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.next8(), 2)
    },
    {
        code: 0x16,
        name: 'LD d,d8',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.next8(), 2)
    },
    {
        code: 0x1E,
        name: 'LD e,d8',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.next8(), 2)
    },
    {
        code: 0x26,
        name: 'LD h,d8',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.next8(), 2)
    },
    {
        code: 0x2E,
        name: 'LD l,d8',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.next8(), 2)
    },
    {
        code: 0x36,
        name: 'LD (hl),d8',
        execute: (cpu: CPU) => load(cpu, cpu.pointerHL8(), cpu.next8(), 3)
    },
];

const load16Codes: Instruction[] = [
    // TODO: Verify endianness: The first byte of immediate data is the lower byte (i.e., bits 0-7), and the second byte of immediate data is the higher byte (i.e., bits 8-15).
    {
        code: 0x01,
        name: 'LD bc,d16',
        execute: (cpu: CPU) => load(cpu, cpu.registers.bc, cpu.next16(), 3)
    },
    {
        code: 0x11,
        name: 'LD de,d16',
        execute: (cpu: CPU) => load(cpu, cpu.registers.de, cpu.next16(), 3)
    },
    {
        code: 0x21,
        name: 'LD hl,d16',
        execute: (cpu: CPU) => load(cpu, cpu.registers.hl, cpu.next16(), 3)
    },
    {
        code: 0x31,
        name: 'LD sp,d16',
        execute: (cpu: CPU) => load(cpu, cpu.registers.sp, cpu.next16(), 3)
    },
    {
        code: 0xF9,
        name: 'LD sp,hl',
        execute: (cpu: CPU) => load(cpu, cpu.registers.sp, cpu.registers.hl, 2)
    },
    // RAM loads
    {
        // TODO: Ensure this does what comment says
        code: 0x08,
        name: 'LD (a16),sp',
        comment: 'Store the lower byte of stack pointer sp at the address specified by the 16-bit immediate operand a16, and store the upper byte of sp at address a16 + 1',
        execute: (cpu: CPU) => load(cpu, cpu.pointer16(cpu.next16().getUint()), cpu.registers.sp, 5)
    },
    // Signed load
    {
        code: 0xF8,
        name: 'LD hl,sp+s8',
        comment: 'Add the 8-bit signed operand s8 (values -128 to +127) to the stack pointer sp, and store the result in register pair hl',
        execute: (cpu: CPU) => {
            // TODO: Endianness, and ensure getInt actually returning -128 to +127
            const value = cpu.registers.sp.getUint() + cpu.next8().getInt();
            cpu.registers.hl.setUint(value);
            cpu.flags.reset();
            // TODO: Set flags C and h

            return { clockCycles: 3 };
        }
    },
];

const miscLoadCodes: Instruction[] = [
    // RAM loads
    {
        code: 0xE0,
        name: 'LD (a8),a',
        execute: (cpu: CPU) => load(cpu, cpu.pointer8(0xff00 + cpu.next8().getUint()), cpu.registers.a, 3)
    },
    {
        code: 0xF0,
        name: 'LD a,(a8)',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.pointer8(0xff00 + cpu.next8().getUint()), 3)
    },
    {
        code: 0xEA,
        name: 'LD (a16),a',
        execute: (cpu: CPU) => load(cpu, cpu.pointer8(cpu.next16().getUint()), cpu.registers.a, 4)
    },
    {
        code: 0xFA,
        name: 'LD a,(a16)',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.pointer8(cpu.next16().getUint()), 4)
    },
    {
        code: 0xE2,
        name: 'LD (c),a',
        execute: (cpu: CPU) => load(cpu, cpu.pointer8(0xff00 + cpu.registers.c.getUint()), cpu.registers.a, 2)
    },
    {
        code: 0xF2,
        name: 'LD a,(c)',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.pointer8(0xff00 + cpu.registers.c.getUint()), 2)
    },
    // 16-bit pointer
    {
        code: 0x02,
        name: 'LD (bc),a',
        execute: (cpu: CPU) => load(cpu, cpu.pointer8(cpu.registers.bc.getUint()), cpu.registers.a, 2)
    },
    {
        code: 0x12,
        name: 'LD (de),a',
        execute: (cpu: CPU) => load(cpu, cpu.pointer8(cpu.registers.de.getUint()), cpu.registers.a, 2)
    },
    {
        code: 0x0A,
        name: 'LD a,(bc)',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.pointer8(cpu.registers.bc.getUint()), 2)
    },
    {
        code: 0x1A,
        name: 'LD a,(de)',
        execute: (cpu: CPU) => load(cpu, cpu.registers.a, cpu.pointer8(cpu.registers.de.getUint()), 2)
    },
    // Increment/Decrement load
    // TODO: Does the inc/dec happen before or after storing? Also verify endianness
    {
        code: 0x22,
        name: 'LD (hl+),a',
        execute: (cpu: CPU) => {
            const result = load(cpu, cpu.pointerHL8(), cpu.registers.a, 2);
            cpu.registers.hl.setUint(cpu.registers.hl.getUint() + 1);
            return result;
        }
    },
    {
        code: 0x32,
        name: 'LD (hl-),a',
        execute: (cpu: CPU) => {
            const result = load(cpu, cpu.pointerHL8(), cpu.registers.a, 2);
            cpu.registers.hl.setUint(cpu.registers.hl.getUint() - 1);
            return result;
        }
    },
    {
        code: 0x2A,
        name: 'LD a,(hl+)',
        execute: (cpu: CPU) => {
            const result = load(cpu, cpu.registers.a, cpu.pointerHL8(), 2);
            cpu.registers.hl.setUint(cpu.registers.hl.getUint() + 1);
            return result;
        }
    },
    {
        code: 0x3A,
        name: 'LD a,(hl-)',
        execute: (cpu: CPU) => {
            const result = load(cpu, cpu.registers.a, cpu.pointerHL8(), 2);
            cpu.registers.hl.setUint(cpu.registers.hl.getUint() - 1);
            return result;
        }
    },
];

export default [
    ...uselessLoadCodes,
    ...load8Codes,
    ...load16Codes,
    ...miscLoadCodes
];