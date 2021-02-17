import { Memory } from "./memory.js";
import { toHex } from "./utils.js";

export type ROMName = `${string}.gb`;

export class Cartridge {
    private arrayBuffer?: ArrayBuffer;
    private uint8Array?: Uint8Array;

    constructor(public name: ROMName, private memory: Memory) {
    }

    get romType(): ROMType {
        return this.uint8Array?.[0x0147] ?? ROMType.Invalid;
    }

    async downloadData(): Promise<void> {
        const result = await fetch('./roms/' + this.name);
        if (!result.ok) {
            throw new Error('ROM ' + this.name + ' could not be loaded.');
        }
        this.arrayBuffer = await result.arrayBuffer();
        this.uint8Array = new Uint8Array(this.arrayBuffer);
    }

    load() {
        switch (this.romType) {
            case ROMType.RomOnly:
                // Load banks 0 and 1
                this.loadIntoMemory(0, 0, 0x8000);
                break;
            default:
                throw new Error('ROM type ' + toHex(this.romType) + ' - ' + ROMType[this.romType] + ' is not implemented.');
        }
    }

    loadIntoMemory(sourceOffset: number, targetOffset: number, end?: number) {
        if (this.uint8Array === undefined) {
            throw new Error('Not loaded yet.');
        }
        this.memory.write(targetOffset, this.uint8Array.slice(sourceOffset, end));
    }

    switchBank(bank: number) {
        switch (this.romType) {
            case ROMType.RomOnly:
                // Bank switching can't be done for this type
                console.warn('ROM type does not support bank switching.');
                break;
            default:
                throw new Error('ROM type ' + toHex(this.romType) + ' - ' + ROMType[this.romType] + ' is not implemented.');
        }
    }

    static initHooks(memory: Memory, gameROM: Cartridge): void {
        memory.data.hooks.push((byteOffset, length, value) => {
            // TODO: Writing 16 bit values is broken for this
            if (byteOffset === 0xFF50 && value !== 0) {
                // Turn off boot rom
                gameROM.loadIntoMemory(0, 0, 0x100);
                return false;
            }
            return true;
        });
    }
}

export enum ROMType {
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
