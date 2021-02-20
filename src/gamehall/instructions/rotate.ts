import { getBit } from "../../binch/utils.js";
import { CPU } from "../cpu.js";
import { InstructionDefinition, NotImplementedError } from "../instruction.js";

export default [
    {
        code: 0x17,
        name: 'RLA',
        execute: (cpu: CPU) => {
            const carry = cpu.flags.c.get();
            const value = cpu.registers.a.getUint();
            cpu.flags.reset();
            cpu.flags.c.setValue(getBit(value, 7));
            cpu.registers.a.setUint(((value & 0b0111_1111) << 1) | (carry ? 0b0000_0001 : 0));
            
            return { clockCycles: 1 };
        }
    },
    {
        code: 0x07,
        name: 'RLCA',
        execute: (cpu: CPU) => { 
            const value = cpu.registers.a.getUint();
            const bit7 = getBit(value, 7);
            // TODO: Check if Z is reset or not (different sources don't use the same)
            cpu.flags.reset();
            cpu.flags.c.setValue(bit7);

            cpu.registers.a.setUint(((value & 0b0111_1111) << 1) | (bit7 ? 1 : 0));

            return { clockCycles: 1 };
        }
    },
    {
        code: 0x1F,
        name: 'RRA',
        execute: (cpu: CPU) => {
            const carry = cpu.flags.c.get();
            const value = cpu.registers.a.getUint();
            cpu.flags.reset();
            cpu.flags.c.setValue(getBit(value, 0));
            cpu.registers.a.setUint(((value & 0b1111_1110) >> 1) | (carry ? 0b1000_0000 : 0));
        
            return { clockCycles: 1 };
        }
    },
    {
        code: 0x0F,
        name: 'RRCA',
        execute: (cpu: CPU) => { throw new NotImplementedError(); }
    }
] as InstructionDefinition[];
