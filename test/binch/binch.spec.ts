import { Binch } from "../../src/binch/binch.js";

describe('Binch', () => {
    let arrayBuffer: ArrayBuffer;
    let uint8Array: Uint8Array;
    let binch: Binch;

    beforeEach(() => {
        // Binch is a sub-section of the ArrayBuffer
        arrayBuffer = new ArrayBuffer(48);
        uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < 8; i++) {
            uint8Array[i] = 128;
        }
        for (let i = 40; i < 48; i++) {
            uint8Array[i] = 128;
        }
        binch = new Binch(arrayBuffer, 8, 32);
    });

    afterEach(() => {
        for (let i = 0; i < 8; i++) {
            if (uint8Array[i] !== 128) {
                throw new Error('ArrayBuffer was changed out of range: ' + i + ' is set to ' + uint8Array[i]);
            }
        }
        for (let i = 40; i < 48; i++) {
            if (uint8Array[i] !== 128) {
                throw new Error('ArrayBuffer was changed out of range: ' + i + ' is set to ' + uint8Array[i]);
            }
        }
    });

    it('sets uint16 (big endian)', () => {
        binch.setUint16(0, 0x12_34, false);
        assert(uint8Array[8], 0x12);
        assert(uint8Array[9], 0x34);

        binch.setUint16(1, 0x56_78, false);
        assert(uint8Array[8], 0x12);
        assert(uint8Array[9], 0x56);
        assert(uint8Array[10], 0x78);

        // TODO: What about setting uint16 at the "last byte"?
    });

    it('sets uint16 (little endian)', () => {
        binch.setUint16(0, 0x12_34, true);
        assert(uint8Array[8], 0x34);
        assert(uint8Array[9], 0x12);

        binch.setUint16(1, 0x56_78, true);
        assert(uint8Array[8], 0x34);
        assert(uint8Array[9], 0x78);
        assert(uint8Array[10], 0x56);

        // TODO: What about setting uint16 at the "last byte"?
    });

    it('gets uint16 (big endian)', () => {
        uint8Array[8] = 0x12;
        uint8Array[9] = 0x34;
        assert(binch.getUint16(0, false), 0x12_34);

        // TODO: What about getting uint16 at the "last byte"?
    });

    it('gets uint16 (little endian)', () => {
        uint8Array[8] = 0x34;
        uint8Array[9] = 0x12;
        assert(binch.getUint16(0, true), 0x12_34);

        // TODO: What about getting uint16 at the "last byte"?
    });

    function toHex(number: number): string {
        if (number <= 0xF) {
            return '0x0' + number.toString(16);
        }
        return '0x' + number.toString(16);
    }
    
    function assert(actual: number, expected: number) {
        if (actual !== expected) {
            console.log(Array.from(uint8Array).map(a => toHex(a)));
            throw new Error('Received ' + toHex(actual) + ' but expected ' + toHex(expected));
        }
    }
});
