export class Binch extends DataView {

    constructor(buffer: ArrayBufferLike, byteOffset?: number, byteLength?: number, ...hooks: BinchHook[]) {
        super(buffer, byteOffset, byteLength);

        this.hooks.push(...hooks);
    }

    readonly hooks: BinchHook[] = [];

    private applyHook(data: BinchHookData): boolean {
        let passThrough = true;
        for (const hook of this.hooks) {
            if (!hook(data)) {
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
        if (this.applyHook({ byteOffset, value, littleEndian, length: 4 })) {
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
        if (this.applyHook({ byteOffset, value, littleEndian, length: 8 })) {
            super.setFloat64(byteOffset, value, littleEndian);
        }
    }

    /**
     * Stores an Int8 value at the specified byte offset from the start of the view.
     * @param byteOffset The place in the buffer at which the value should be set.
     * @param value The value to set.
     */
    setInt8(byteOffset: number, value: number): void {
        if (this.applyHook({ byteOffset, value, length: 1 })) {
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
        if (this.applyHook({ byteOffset, value, littleEndian, length: 2 })) {
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
        if (this.applyHook({ byteOffset, value, littleEndian, length: 4 })) {
            super.setInt32(byteOffset, value, littleEndian);
        }
    }

    /**
     * Stores an Uint8 value at the specified byte offset from the start of the view.
     * @param byteOffset The place in the buffer at which the value should be set.
     * @param value The value to set.
     */
    setUint8(byteOffset: number, value: number): void {
        if (this.applyHook({ byteOffset, value, length: 1 })) {
            super.setUint8(byteOffset, value);
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
        if (this.applyHook({ byteOffset, value, littleEndian, length: 2 })) {
            super.setUint16(byteOffset, value, littleEndian);
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
        if (this.applyHook({ byteOffset, value, littleEndian, length: 4 })) {
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
        return super.getUint8(byteOffset);
    }

    /**
     * Gets the Uint16 value at the specified byte offset from the start of the view. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     * @param byteOffset The place in the buffer at which the value should be retrieved.
     */
    getUint16(byteOffset: number, littleEndian = true): number {
        return super.getUint16(byteOffset, littleEndian);
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
 * @returns True if passthrough, false if cancels the write.
 */
export type BinchHook = (data: BinchHookData) => boolean;

export interface BinchHookData {
    byteOffset: number;
    length: number;
    value: number;
    /**
     * Undefined if length <= 1.
     */
    littleEndian?: boolean;
}
