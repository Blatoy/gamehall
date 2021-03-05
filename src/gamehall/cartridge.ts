import { BinchHook } from "../binch/binch.js";
import { Memory } from "./memory.js";
import { toHex } from "./utils.js";
import CartridgeTypeList from './cartridge-types/index.js';

export type ROMName = `${string}.gb`;

export const ROM_START = 0x0000;
export const SWITCHABLE_BANK_START = 0x4000;
export const SWITCHABLE_BANK_END = 0x7FFF;
export const RAM_START = 0xA000;
export const RAM_END = 0xBFFF;
export const RAM_SIZE = 1 + RAM_END - RAM_START;


export class CartridgeController {
    protected readonly cartridgeTypes: (CartridgeType | null)[];
    gameROM?: CartridgeData;
    bootROM?: CartridgeData;
    cartridge?: Cartridge;

    constructor(public memory: Memory) {
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

    async initialize(bootROM: ROMName, gameROM: ROMName): Promise<void> {
        const bootData = CartridgeController.downloadData(bootROM).then(data => this.bootROM = data);
        const gameData = CartridgeController.downloadData(gameROM).then(data => this.gameROM = data);
        await Promise.all([bootData, gameData]);
    
        // Load cartridge (including default banks of gameROM)
        this.loadCartridge();
    
        // Override beginning with bootROM
        this.loadIntoMemory(0, 0, undefined, 'boot');
    
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
        this.memory.data.hooks.push((byteOffset, length, value, littleEndian) => {
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

        this.memory.write(targetOffset, uint8Array.slice(sourceOffset, sourceEnd));
    }
}

export interface CartridgeData {
    arrayBuffer: ArrayBuffer;
    uint8Array: Uint8Array;
}

export interface Cartridge {
    load(): void;
    onMemoryWrite?: BinchHook;
}
export type CartridgeType = {
    code: number;
    new(controller: CartridgeController): Cartridge
};

/*
export enum CartridgeType {
    Invalid = -1,
    RomOnly = 0x00,
    Mbc1 = 0x01,
    Mbc1Ram = 0x02,
    Mbc1RamBattery = 0x03,
    Mbc2 = 0x05,
    Mbc2Battery = 0x06,
    RomRam = 0x08,
    RomRamBattery = 0x09,
    Mmm01 = 0x0b,
    Mmm01Ram = 0x0c,
    Mmm01RamBattery = 0x0d,
    Mbc3TimerBattery = 0x0f,
    Mbc3TimerRamBattery = 0x10,
    Mbc3 = 0x11,
    Mbc3Ram = 0x12,
    Mbc3RamBattery = 0x13,
    Mbc5 = 0x19,
    Mbc5Ram = 0x1a,
    Mbc5RamBattery = 0x1b,
    Mbc5Rumble = 0x1c,
    Mbc5RumbleRam = 0x1d,
    Mbc5RumbleRamBattery = 0x1e,
    Mbc6 = 0x20,
    Mbc7SensorRumbleRamBattery = 0x22,
    PocketCamera = 0xfc,
    BandaiTama5 = 0xfd,
    Huc3 = 0xfe,
    Huc1RamBattery = 0xff
}
*/
