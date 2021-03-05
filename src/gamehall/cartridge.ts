import { BinchHook } from "../binch/binch.js";
import { CartridgeController } from "./cartridge-controller.js";

export const ROM_START = 0x0000;
export const SWITCHABLE_BANK_START = 0x4000;
export const SWITCHABLE_BANK_END = 0x7FFF;
export const RAM_START = 0xA000;
export const RAM_END = 0xBFFF;
export const RAM_SIZE = 1 + RAM_END - RAM_START;

export type ROMName = `${string}.gb`;

export interface Cartridge {
    load(): void;
    onMemoryWrite?: BinchHook;
}
export type CartridgeType = {
    code: number;
    new(controller: CartridgeController): Cartridge
};

/*
Cartridge types
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
*/
