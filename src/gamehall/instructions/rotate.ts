import { getBit } from "../../binch/utils.js";
import { CPU } from "../cpu.js";
import { Instruction } from "../instruction.js";

export default [
    {
        code: 0x17,
        comment: "Rotate left through the carry flag",
        name: 'RLA',
        execute: (cpu: CPU) => {
            const carry = cpu.flags.c.get();
            const value = cpu.registers.a.getUint();
            cpu.flags.reset();
            cpu.flags.c.setValue(getBit(value, 7));
            cpu.registers.a.setUint(((value & 0b0111_1111) << 1) | (carry ? 0b0000_0001 : 0));
            
            return { machineCycles: 1 };
        }
    },
    {
        code: 0x07,
        comment: "Rotate left, carry flag is set to value of bit 7",
        name: 'RLCA',
        execute: (cpu: CPU) => { 
            const value = cpu.registers.a.getUint();
            const bit7 = getBit(value, 7);

            cpu.flags.reset();
            cpu.flags.c.setValue(bit7);

            cpu.registers.a.setUint(((value & 0b0111_1111) << 1) | (bit7 ? 1 : 0));

            return { machineCycles: 1 };
        }
    },
    {
        code: 0x1F,
        comment: "Rotate right through the carry flag",
        name: 'RRA',
        execute: (cpu: CPU) => {
            const carry = cpu.flags.c.get();
            const value = cpu.registers.a.getUint();
            cpu.flags.reset();
            cpu.flags.c.setValue(getBit(value, 0));
            cpu.registers.a.setUint((value >> 1) | (carry ? 0b1000_0000 : 0));
        
            return { machineCycles: 1 };
        }
    },
    {
        code: 0x0F,
        comment: "Rotate right, carry flag is set to value of bit 0",
        name: 'RRCA',
        execute: (cpu: CPU) => {
            const value = cpu.registers.a.getUint();
            const bit0 = getBit(value, 0);

            cpu.flags.reset();
            cpu.flags.c.setValue(bit0);

            cpu.registers.a.setUint((value >> 1) | (bit0 ? 0b1000_0000 : 0));

            return { machineCycles: 1 };
        }
    }
] as Instruction[];
