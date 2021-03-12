import { Binch } from "../binch/binch.js";

/**
 * GameBoy memory map.
 * @example
 * `
 * GameBoy Memory Areas
 * $FFFF        Interrupt Enable Flag
 * $FF80-$FFFE  Zero Page - 127 bytes
 * $FF00-$FF7F  Hardware I/O Registers
 * $FEA0-$FEFF  Unusable Memory
 * $FE00-$FE9F  OAM - Object Attribute Memory
 * $E000-$FDFF  Echo RAM - Reserved, Do Not Use
 * $D000-$DFFF  Internal RAM - Bank 1-7 (switchable - CGB only)
 * $C000-$CFFF  Internal RAM - Bank 0 (fixed)
 * $A000-$BFFF  Cartridge RAM (If Available)
 * $9C00-$9FFF  BG Map Data 2
 * $9800-$9BFF  BG Map Data 1
 * $8000-$97FF  Character RAM
 * $4000-$7FFF  Cartridge ROM - Switchable Banks 1-xx
 * $0150-$3FFF  Cartridge ROM - Bank 0 (fixed)
 * $0100-$014F  Cartridge Header Area
 * $0000-$00FF  Restart and Interrupt Vectors
 * `
 */
export class Memory {
    readonly arrayBuffer = new ArrayBuffer(0x10000);
    readonly uint8Array = new Uint8Array(this.arrayBuffer);
    readonly data = new Binch(this.arrayBuffer);

    init(): void {
        // Start out cleared
        for (let i = 0; i < 0x10000; i++) {
            this.uint8Array[i] = 0;
        }

        // RAM is random
        for (let i = 0xC000; i < 0xDFFF; i++) {
            this.uint8Array[i] = Math.floor(Math.random() * 255);
        }

        // Source: https://gbdev.io/pandocs/#power-up-sequence
        this.uint8Array[0xFF05] = 0x00; // TIMA
        this.uint8Array[0xFF06] = 0x00; // TMA
        this.uint8Array[0xFF07] = 0x00; // TAC
        this.uint8Array[0xFF10] = 0x80; // NR10
        this.uint8Array[0xFF11] = 0xBF; // NR11
        this.uint8Array[0xFF12] = 0xF3; // NR12
        this.uint8Array[0xFF14] = 0xBF; // NR14
        this.uint8Array[0xFF16] = 0x3F; // NR21
        this.uint8Array[0xFF17] = 0x00; // NR22
        this.uint8Array[0xFF19] = 0xBF; // NR24
        this.uint8Array[0xFF1A] = 0x7F; // NR30
        this.uint8Array[0xFF1B] = 0xFF; // NR31
        this.uint8Array[0xFF1C] = 0x9F; // NR32
        this.uint8Array[0xFF1E] = 0xBF; // NR34
        this.uint8Array[0xFF20] = 0xFF; // NR41
        this.uint8Array[0xFF21] = 0x00; // NR42
        this.uint8Array[0xFF22] = 0x00; // NR43
        this.uint8Array[0xFF23] = 0xBF; // NR44
        this.uint8Array[0xFF24] = 0x77; // NR50
        this.uint8Array[0xFF25] = 0xF3; // NR51
        // TODO: Set this memory depending on GB flag
        // this.uint8Array[0xFF26] = 0xF1; // 0xF1 -GB, $F0-SGB ; NR52
        this.uint8Array[0xFF40] = 0x91; // LCDC
        this.uint8Array[0xFF41] = 0x03; // STAT
        this.uint8Array[0xFF42] = 0x00; // SCY
        this.uint8Array[0xFF43] = 0x00; // SCX
        this.uint8Array[0xFF45] = 0x00; // LYC
        this.uint8Array[0xFF47] = 0xFC; // BGP
        this.uint8Array[0xFF48] = 0xFF; // OBP0
        this.uint8Array[0xFF49] = 0xFF; // OBP1
        this.uint8Array[0xFF4A] = 0x00; // WY
        this.uint8Array[0xFF4B] = 0x00; // WX
        this.uint8Array[0xFFFF] = 0x00; // IE
    }

    /**
     * Writes a byte array to memory without executing any hooks.
     */
    write(byteOffset: number, value: ArrayLike<number>): void {
        this.uint8Array.set(value, byteOffset);
    }

    
    writeUint8Array(uint8Array: Uint8Array, targetOffset: number = 0, sourceOffset: number = 0, size: number | undefined = undefined) {
        if (size === undefined) {
            size = uint8Array.byteLength;
        }
        this.write(targetOffset, uint8Array.slice(sourceOffset, sourceOffset + size));
    }

    search(data: number[], start = 0): number {
        let matches = 0;
        for (let i = start; i < this.uint8Array.byteLength; i++) {
            if (this.uint8Array[i] === data[matches]) {
                matches++;
            } else if (matches > 0) {
                matches = 0;
                i--;
            }

            if (matches === data.length) {
                return i - data.length + 1;
            }
        }
        return -1;
    }

    searchAll(data: number[], start = 0): number[] {
        const results: number[] = [];
        while (start < this.uint8Array.byteLength) {
            const result = this.search(data, start);
            if (result < 0) {
                break;
            }
            results.push(result);
            start = result + 1;
        }
        return results;
    }
}

/**
 * List of important memory offsets. 
 */
export enum MemoryOffsets {
    RestartInterruptVectors = 0x0000,
    InterruptEnableFlag = 0xFFFF
}
