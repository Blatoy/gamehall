import { CartridgeController } from '../cartridge-controller.js';
import { SWITCHABLE_BANK_END, Cartridge, CartridgeType } from '../cartridge.js';

class ROMOnly implements Cartridge {
    constructor(private controller: CartridgeController) { }

    static get code(): number {
        return 0x00;
    }

    load(): void {
        // Load banks 0 and 1
        this.controller.loadIntoMemory(0, 0, SWITCHABLE_BANK_END);
    }

    onMemoryWrite(byteOffset: number, length: number, value: number, littleEndian?: boolean): boolean {
        return byteOffset > SWITCHABLE_BANK_END;
    }
}

export default [
    ROMOnly
] as CartridgeType[];
