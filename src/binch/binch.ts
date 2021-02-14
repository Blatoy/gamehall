export class Binch extends DataView {

    constructor(buffer: ArrayBufferLike, byteOffset?: number, byteLength?: number, ...hooks: BinchHook[]) {
        super(buffer, byteOffset, byteLength);

        this.uint8Array = new Uint8Array(buffer, byteOffset, byteLength);

        this.hooks.push(...hooks);
    }

    private uint8Array: Uint8Array;
    readonly hooks: BinchHook[] = [];

    /**
     * @param littleEndian Undefined if length <= 1.
     */
    private applyHook(byteOffset: number, length: number, value: number, littleEndian?: boolean): boolean {
        let passThrough = true;
        for (const hook of this.hooks) {
            if (!hook(byteOffset, length, value, littleEndian)) {
                passThrough = false;
            }
        }
        return passThrough;
    }

    /**
     * Stores an Float32 value at the specified byte offset from the start of the view.
     * @param byteOffset The place in the buffer at which the value should be set.
     * @param value The value to set.
     * @param littleEndian If false, a big-endian value should be written,
     * otherwise a little-endian value should be written.
     */
    setFloat32(byteOffset: number, value: number, littleEndian = true): void {
        if (this.applyHook(byteOffset, 4, value, littleEndian)) {
            super.setFloat32(byteOffset, value, littleEndian);
        }
    }

    /**
     * Stores an Float64 value at the specified byte offset from the start of the view.
     * @param byteOffset The place in the buffer at which the value should be set.
     * @param value The value to set.
     * @param littleEndian If false, a big-endian value should be written,
     * otherwise a little-endian value should be written.
     */
    setFloat64(byteOffset: number, value: number, littleEndian = true): void {
        if (this.applyHook(byteOffset, 8, value, littleEndian)) {
            super.setFloat64(byteOffset, value, littleEndian);
        }
    }

    /**
     * Stores an Int8 value at the specified byte offset from the start of the view.
     * @param byteOffset The place in the buffer at which the value should be set.
     * @param value The value to set.
     */
    setInt8(byteOffset: number, value: number): void {
        if (this.applyHook(byteOffset, 1, value)) {
            super.setInt8(byteOffset, value);
        }
    }

    /**
     * Stores an Int16 value at the specified byte offset from the start of the view.
     * @param byteOffset The place in the buffer at which the value should be set.
     * @param value The value to set.
     * @param littleEndian If false, a big-endian value should be written,
     * otherwise a little-endian value should be written.
     */
    setInt16(byteOffset: number, value: number, littleEndian = true): void {
        if (this.applyHook(byteOffset, 2, value, littleEndian)) {
            super.setInt16(byteOffset, value, littleEndian);
        }
    }

    /**
     * Stores an Int32 value at the specified byte offset from the start of the view.
     * @param byteOffset The place in the buffer at which the value should be set.
     * @param value The value to set.
     * @param littleEndian If false, a big-endian value should be written,
     * otherwise a little-endian value should be written.
     */
    setInt32(byteOffset: number, value: number, littleEndian = true): void {
        if (this.applyHook(byteOffset, 4, value, littleEndian)) {
            super.setInt32(byteOffset, value, littleEndian);
        }
    }

    /**
     * Stores an Uint8 value at the specified byte offset from the start of the view.
     * @param byteOffset The place in the buffer at which the value should be set.
     * @param value The value to set.
     */
    setUint8(byteOffset: number, value: number): void {
        if (this.applyHook(byteOffset, 1, value)) {
            this.uint8Array[byteOffset] = value;
        }
    }

    /**
     * Stores an Uint16 value at the specified byte offset from the start of the view.
     * @param byteOffset The place in the buffer at which the value should be set.
     * @param value The value to set.
     * @param littleEndian If false, a big-endian value should be written,
     * otherwise a little-endian value should be written.
     */
    setUint16(byteOffset: number, value: number, littleEndian = true): void {
        if (this.applyHook(byteOffset, 2, value, littleEndian)) {
            if (littleEndian) {
                this.uint8Array[byteOffset] = value & 0x00FF;
                this.uint8Array[byteOffset + 1] = (value & 0xFF00) >> 8;
            } else {
                this.uint8Array[byteOffset] = (value & 0xFF00) >> 8;
                this.uint8Array[byteOffset + 1] = value & 0x00FF;
            }
        }
    }

    /**
     * Stores an Uint32 value at the specified byte offset from the start of the view.
     * @param byteOffset The place in the buffer at which the value should be set.
     * @param value The value to set.
     * @param littleEndian If false, a big-endian value should be written,
     * otherwise a little-endian value should be written.
     */
    setUint32(byteOffset: number, value: number, littleEndian = true): void {
        if (this.applyHook(byteOffset, 4, value, littleEndian )) {
            super.setUint32(byteOffset, value, littleEndian);
        }
    }

    /**
     * Gets the Float32 value at the specified byte offset from the start of the view. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     * @param byteOffset The place in the buffer at which the value should be retrieved.
     */
    getFloat32(byteOffset: number, littleEndian = true): number {
        return super.getFloat32(byteOffset, littleEndian);
    }

    /**
     * Gets the Float64 value at the specified byte offset from the start of the view. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     * @param byteOffset The place in the buffer at which the value should be retrieved.
     */
    getFloat64(byteOffset: number, littleEndian = true): number {
        return super.getFloat64(byteOffset, littleEndian);
    }

    /**
     * Gets the Int8 value at the specified byte offset from the start of the view. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     * @param byteOffset The place in the buffer at which the value should be retrieved.
     */
    getInt8(byteOffset: number): number {
        return super.getInt8(byteOffset)
    }

    /**
     * Gets the Int16 value at the specified byte offset from the start of the view. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     * @param byteOffset The place in the buffer at which the value should be retrieved.
     */
    getInt16(byteOffset: number, littleEndian = true): number {
        return super.getInt16(byteOffset, littleEndian);
    }

    /**
     * Gets the Int32 value at the specified byte offset from the start of the view. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     * @param byteOffset The place in the buffer at which the value should be retrieved.
     */
    getInt32(byteOffset: number, littleEndian = true): number {
        return super.getInt32(byteOffset, littleEndian);
    }

    /**
     * Gets the Uint8 value at the specified byte offset from the start of the view. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     * @param byteOffset The place in the buffer at which the value should be retrieved.
     */
    getUint8(byteOffset: number): number {
        return this.uint8Array[byteOffset];
    }

    /**
     * Gets the Uint16 value at the specified byte offset from the start of the view. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     * @param byteOffset The place in the buffer at which the value should be retrieved.
     */
    getUint16(byteOffset: number, littleEndian = true): number {
        if (littleEndian) {
            return this.uint8Array[byteOffset] | (this.uint8Array[byteOffset + 1] << 8);
        } else {
            return (this.uint8Array[byteOffset] << 8) | this.uint8Array[byteOffset + 1];
        }
    }

    /**
     * Gets the Uint32 value at the specified byte offset from the start of the view. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     * @param byteOffset The place in the buffer at which the value should be retrieved.
     */
    getUint32(byteOffset: number, littleEndian = true): number {
        return super.getUint32(byteOffset, littleEndian);
    }
}

/**
 * @param littleEndian Undefined if length <= 1.
 * @returns True if passthrough, false if cancels the write.
 */
export type BinchHook = (byteOffset: number, length: number, value: number, littleEndian?: boolean) => boolean;

export interface BinchHookData {
    byteOffset: number;
    length: number;
    value: number;
    /**
     * Undefined if length <= 1.
     */
    littleEndian?: boolean;
}
