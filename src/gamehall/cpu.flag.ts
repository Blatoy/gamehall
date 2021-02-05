import { Pointer8, Pointer16, Pointer } from "./pointer.js";

export class Flag {
    constructor(private f: Pointer8, private bitOffset: number) { }

    get(): boolean {
        return this.f.getBit(this.bitOffset);
    }

    clear(): void {
        this.f.clearBit(this.bitOffset);
    }

    set(): void {
        this.f.setBit(this.bitOffset);
    }
}

export class ZeroFlag extends Flag {
    compute(value: number | Pointer8 | Pointer16): boolean {
        if (value instanceof Pointer) {
            value = value.getUint();
        }

        if (value === 0) {
            this.set();
            return true;
        } else {
            this.clear();
            return false;
        }
    }
}

export class CarryFlag extends Flag {
    /*compute8Add(value1: number | Pointer8, value2: number | Pointer8) {
        if (value1 instanceof Pointer) {
            value1 = value1.getUint();
        }
        if (value2 instanceof Pointer) {
            value2 = value2.getUint();
        }

        // Overflow
        if (value1 + value2 > 0xFF) {
            this.set();
            return true;
        } else {
            this.clear();
            return false;
        }
    }

    compute16Add(value1: number | Pointer16, value2: number | Pointer16) {
        if (value1 instanceof Pointer) {
            value1 = value1.getUint();
        }
        if (value2 instanceof Pointer) {
            value2 = value2.getUint();
        }

        // Overflow
        if (value1 + value2 > 0xFFFF) {
            this.set();
            return true;
        } else {
            this.clear();
            return false;
        }
    }*/

    /**
     * value1 - value2
     * @param value1 
     * @param value2 
     */
    /* computeSub(value1: number | Pointer8 | Pointer16, value2: number | Pointer8 | Pointer16) {
         if (value1 instanceof Pointer) {
             value1 = value1.getUint();
         }
         if (value2 instanceof Pointer) {
             value2 = value2.getUint();
         }
 
         // Result < 0 => underflow
         if (value2 > value1) {
             this.set();
             return true;
         } else {
             this.clear();
             return false;
         }
     }
 */
    /*compute16() {
        // TODO: Check half carry flag
        // cpu.registers.flags.h = (((cpu.registers.hl.asUint16 & 0xFF) + (value & 0xFF)) & 0x1000) === 0x1000;
        // cpu.registers.flags.c = value + cpu.registers.hl.asUint16 > 0xFFFF;
    }*/
}

export class HalfCarryFlag extends Flag {
    /*computeAdd(value1: number | Pointer8, value2: number | Pointer8): boolean {
        if (value1 instanceof Pointer) {
            value1 = value1.getUint();
        }

        if (value2 instanceof Pointer) {
            value2 = value2.getUint();
        }

        if((value1 & 0xF)) {
            
        }
        // (((cpu.registers.a.asUint8 & 0xF) - (value & 0xF)) & 0x10) === 0x10
        // set_flag(FLAG_HALF_CARRY, (((target & 0xF) - (value & 0xF)) < 0));
    }

    compute8Sub(value1: number | Pointer8, value2: number | Pointer8): boolean {
        if (value1 instanceof Pointer) {
            value1 = value1.getUint();
        }

        if (value2 instanceof Pointer) {
            value2 = value2.getUint();
        }
        
        if ((value1 & 0xF) < (value2&0xF)) {
            
        }
    }
*/
    /* compute16(): boolean {
         // TODO
         // DAA: (registers.f & 0x20) ? true : false;
         // INC: ((register & 0xF) + 1) & 0x10;
         // DEC: (register & 0xF) < 1
         // LD:  (sp & 0xF) + (data & 0xF) > 0xF;
         // ADD: (sp & 0xF) + (value & 0xF) > 0xF
         // ADD: ((v1 & 0xFFF) + (v2 & 0xFFF)) & 0x1000
         // SUB: (registers.a & 0xF ) < (data & 0xF)
         // CP:  (registers.a & 0xF ) < (data & 0xF)
         // SBC: (registers.a & 0xF ) < (data & 0xF) + carry
         // DAA: (registers.f & 0x20) ? true : false
         return false;
     }*/
}
