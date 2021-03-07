import { Cartridge, CartridgeType, ROMName } from "./cartridge.js";
import CartridgeTypeList from './cartridge-types/index.js';
import { toHex } from "./utils.js";
import { CPU } from "./cpu.js";

export interface CartridgeData {
    arrayBuffer: ArrayBuffer;
    uint8Array: Uint8Array;
}

export class CartridgeController {
    protected readonly cartridgeTypes: (CartridgeType | null)[];
    gameROM?: CartridgeData;
    bootROM?: CartridgeData;
    cartridge?: Cartridge;

    constructor(public cpu: CPU) {
        this.cartridgeTypes = new Array(256).fill(null);
        for (const cartridgeType of CartridgeTypeList) {
            this.cartridgeTypes[cartridgeType.code] = cartridgeType;
        }
    }

    protected get cartridgeCode(): number | undefined {
        return this.gameROM?.uint8Array[0x0147];
    }

    static async downloadData(name: ROMName): Promise<CartridgeData> {
        const result = await fetch('./roms/' + name);
        if (!result.ok) {
            throw new Error('ROM ' + name + ' could not be loaded.');
        }

        const arrayBuffer = await result.arrayBuffer();
        return {
            arrayBuffer,
            uint8Array: new Uint8Array(arrayBuffer)
        };
    }

    async initialize(bootROM: ROMName, gameROM: ROMName, skipBootROM = false): Promise<void> {
        const bootData = CartridgeController.downloadData(bootROM).then(data => this.bootROM = data);
        const gameData = CartridgeController.downloadData(gameROM).then(data => this.gameROM = data);
        await Promise.all([bootData, gameData]);
    
        // Load cartridge (including default banks of gameROM)
        this.loadCartridge();
    
        if (skipBootROM) {
            // TODO: Check if other initialization steps are required
            this.cpu.registers.sp.setUint(0xfffe);
            this.cpu.registers.pc.setUint(0x0100);
            this.cpu.registers.hl.setUint(0x014d);
            this.cpu.registers.af.setUint(0x01b0);
            this.cpu.registers.de.setUint(0x00d8);
            this.cpu.registers.bc.setUint(0x0013);
        } else {
            // Override beginning with bootROM
            this.loadIntoMemory(0, 0, undefined, 'boot');
        }
    
        this.initHooks();
    }

    loadCartridge(): void {
        if (this.cartridgeCode === undefined) {
            throw new Error('No ROM loaded, can not load cartridge.');
        }

        const cartridgeType = this.cartridgeTypes[this.cartridgeCode];

        if (cartridgeType === null) {
            throw new Error('Unknown cartridge type: ' + toHex(this.cartridgeCode));
        }

        this.cartridge = new cartridgeType(this);
        this.cartridge.load();
    }

    initHooks(): void {
        if (this.cartridge === undefined) {
            throw new Error('No cartridge loaded, can not init memory hooks.');
        }

        // TODO: Remove old hook
        this.cpu.memory.data.hooks.push((byteOffset, length, value, littleEndian) => {
            // TODO: Writing 16 bit values is broken for this
            if (byteOffset === 0xFF50 && value !== 0) {
                // Turn off boot rom
                
                this.loadIntoMemory(0, 0, 0x100);
                return false;
            } else if (this.cartridge!.onMemoryWrite !== undefined) {
                // Run the cartridge's memory hook
                return this.cartridge!.onMemoryWrite(byteOffset, length, value, littleEndian);
            }
            return true;
        });
    }

    /**
     * @param sourceEnd Inclusive
     */
    loadIntoMemory(sourceOffset: number, targetOffset: number, sourceEnd?: number, dataSource: 'game' | 'boot' = 'game') {
        const uint8Array = dataSource === 'boot' ? this.bootROM?.uint8Array : this.gameROM?.uint8Array;
        if (uint8Array === undefined) {
            throw new Error('ROM is not loaded yet.');
        }

        if (sourceEnd !== undefined) {
            // Inclusive
            sourceEnd++;
        }

        this.cpu.memory.write(targetOffset, uint8Array.slice(sourceOffset, sourceEnd));
    }
}
