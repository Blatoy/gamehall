import { Binch } from "../binch/binch.js";

export class Pointer {
    constructor(protected readonly binch: Binch, protected byteOffset: number) { }
}

export class Pointer8 extends Pointer {
    getInt(): number {
        return this.binch.getInt8(this.byteOffset);
    }

    setInt(value: number): void {
        this.binch.setInt8(this.byteOffset, value);
    }

    getUint(): number {
        return this.binch.getUint8(this.byteOffset);
    }

    setUint(value: number): void {
        this.binch.setUint8(this.byteOffset, value);
    }

    getBit(index: number): boolean {
        return (this.getUint() & (1 << index)) !== 0;
    }

    clearBit(index: number): void {
        this.setUint(this.getUint() & ~(1 << index));
    }

    setBit(index: number): void {
        this.setUint(this.getUint() | (1 << index));
    }
}

export class Pointer16 extends Pointer {
    getInt(littleEndian = true): number {
        return this.binch.getInt16(this.byteOffset, littleEndian);
    }

    setInt(value: number, littleEndian = true): void {
        this.binch.setInt16(this.byteOffset, value, littleEndian);
    }

    getUint(littleEndian = true): number {
        return this.binch.getUint16(this.byteOffset, littleEndian);
    }

    setUint(value: number, littleEndian = true): void {
        this.binch.setUint16(this.byteOffset, value, littleEndian);
    }

    getBit(index: number, littleEndian = true): boolean {
        return (this.getUint(littleEndian) & (1 << index)) !== 0;
    }

    clearBit(index: number, littleEndian = true): void {
        this.setUint(this.getUint(littleEndian) & ~(1 << index));
    }

    setBit(index: number, littleEndian = true): void {
        this.setUint(this.getUint(littleEndian) | (1 << index));
    }
}
