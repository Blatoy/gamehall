export function getBit(value: number, index: number): boolean {
    // TODO: what about 16-bit and endianness sadness
    const bitMask = 1 << index;
    return (value & bitMask) !== 0;
}
