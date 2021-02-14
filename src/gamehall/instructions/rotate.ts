import { getBit } from "../../binch/utils.js";
import { CPU } from "../cpu.js";
import { InstructionDefinition, NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0x17,
        name: 'RLA',
        execute: (cpu: CPU) => {
            cpu.flags.reset();

            const value = cpu.registers.a.getUint();
            if (getBit(value, 0)) {
                cpu.flags.c.set();
            } else {
                cpu.flags.c.clear();
            }
            cpu.registers.a.setUint(((value & 0b1111_1110) >> 1) | (cpu.flags.c.get() ? 0b1000_0000 : 0));
            
            return { clockCycles: 1 };
        }
    },
    {
        code: 0x07,
        name: 'RLCA',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    },
    {
        code: 0x1F,
        name: 'RRA',
        execute: (cpu: CPU) => {
            cpu.flags.reset();

            const value = cpu.registers.a.getUint();
            if (getBit(value, 7)) {
                cpu.flags.c.set();
            } else {
                cpu.flags.c.clear();
            }
            cpu.registers.a.setUint(((value & 0b0111_1111) >> 1) | (cpu.flags.c.get() ? 1 : 0));
        
            return { clockCycles: 1 };
        }
    },
    {
        code: 0x0F,
        name: 'RRCA',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
] as InstructionDefinition[];
