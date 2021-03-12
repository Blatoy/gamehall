import { CartridgeController } from '../cartridge-controller.js';
import { RAM_END, RAM_SIZE, RAM_START, SWITCHABLE_BANK_END, Cartridge, CartridgeType, SWITCHABLE_BANK_SIZE, SWITCHABLE_BANK_START, ROM_START } from '../cartridge.js';

const RAM_BANK_COUNT = 3;

enum BankingMode {
    Simple,
    Advanced
}

class MBC1 implements Cartridge {
    static get code(): number {
        return 0x01;
    }

    bankingMode = BankingMode.Simple;

    ramBanks: Array<Uint8Array> = [];
    ramEnabled = false;

    ramSize = -1;
    romSize = -1;
    romBankCount = -1;
    ramBankCount = -1;

    currentLowBankValue = 0x01;
    currentHighBankValue = 0x00;

    constructor(private controller: CartridgeController) { }

    isLargeROM(): boolean {
        return this.romSize >= 1024 * 1024;
    }

    isLargeRAM(): boolean {
        return this.ramSize >= 8 * 1024;
    }

    disableRam() {
        for (let i = 0; i < RAM_SIZE; i++) {
            this.controller.cpu.memory.uint8Array[RAM_START + i] = 0xFF;
        }
    }

    load(): void {
        // Load banks 0 and 1
        this.controller.loadIntoMemory(0, 0, SWITCHABLE_BANK_END, "game");
        // Load FF into RAM as it is disabled by default
        this.disableRam();

        this.romBankCount = this.controller.gameROM!.uint8Array.byteLength / SWITCHABLE_BANK_SIZE;
        this.romSize = 32 * 1024 << this.controller.gameROM!.uint8Array[0x148];

        switch (this.controller.gameROM!.uint8Array[0x149]) {
            case 0:
            case 1:
                this.ramSize = 0; // no ram or unused
                this.ramBankCount = 0;
                break;
            case 2:
                this.ramSize = 8 * 1024;
                this.ramBankCount = 1;
                break;
            case 3:
                this.ramSize = 32 * 1024;
                this.ramBankCount = 4;
                break;
            case 4:
                this.ramSize = 128 * 1024;
                this.ramBankCount = 16;
                break;
            case 5:
                this.ramSize = 64 * 1024;
                this.ramBankCount = 8;
                break;
        }

        for (let i = 0; i < this.ramBankCount; i++) {
            let ramBuffer = new ArrayBuffer(RAM_SIZE);
            this.ramBanks.push(new Uint8Array(ramBuffer));
        }
    }

    getSelectedRamBank(): Uint8Array | undefined{
        if (this.ramBankCount === 0) {
            return undefined;
        }

        if (this.bankingMode === BankingMode.Simple || !this.isLargeRAM()) {
            return this.ramBanks[0];
        } else {
            // TODO: % this number if required?
            return this.ramBanks[this.currentHighBankValue >> 5];
        }
    }

    copySelectedRamBankToMemory() {
        if (this.ramEnabled) {
            let selectedRamBank = this.getSelectedRamBank();
            if (selectedRamBank) {
                this.controller.cpu.memory.writeUint8Array(selectedRamBank, RAM_START);
            }
        } else {
            this.disableRam();
        }
    }

    copySelectedRomBankToMemory() {
        let selectedRomBank = this.currentLowBankValue;

        if (this.isLargeROM()) {
            // Large ROM also use high bit values
            selectedRomBank += this.currentHighBankValue;
        }

        // Swap ROM bank at 0x4000
        let memoryBank = this.controller.gameROM!.uint8Array.slice(SWITCHABLE_BANK_SIZE * selectedRomBank, SWITCHABLE_BANK_SIZE * (selectedRomBank + 1) - 1);
        this.controller.cpu.memory.write(SWITCHABLE_BANK_START, memoryBank);

        if (this.bankingMode === BankingMode.Advanced && this.isLargeROM()) {
            let selectedRomBank = this.currentHighBankValue;
            let memoryBank = this.controller.gameROM!.uint8Array.slice(SWITCHABLE_BANK_SIZE * selectedRomBank, SWITCHABLE_BANK_SIZE * (selectedRomBank + 1) - 1);
            this.controller.cpu.memory.write(ROM_START, memoryBank);
        } else if(this.isLargeROM()) {
            // Swap back in ROM 0
            // TODO: If this is slow add a check to not do it if it's already in place
            let memoryBank = this.controller.gameROM!.uint8Array.slice(0, SWITCHABLE_BANK_SIZE - 1);
            this.controller.cpu.memory.write(ROM_START, memoryBank);
        }
    }


    onMemoryWrite(byteOffset: number, length: number, value: number, littleEndian?: boolean): boolean {

        // Enable or disable external RAM access
        if (byteOffset <= 0x1FFF) {
            this.ramEnabled = (0x0A & value) === 0x0A;
            this.copySelectedRamBankToMemory();
            return false;
        }

        // Set the low bank value (which is always bank number)
        if (byteOffset >= 0x2000 && byteOffset <= 0x3FFF) {
            // Create a mask to ignore all bits above the max possible bank count of the cartridge
            let mask = Math.pow(2, (Math.floor(Math.log2(this.romBankCount) + 1))) - 1; // This could be cached
            value &= mask & 0b0001_1111;

            // Cannot have these values in low bank value, it always pick +1 if any of these is picked
            if (value === 0x00 || value === 0x20 || value === 0x40 || value === 0x60) {
                value++;
            }

            this.currentLowBankValue = value;

            this.copySelectedRomBankToMemory();
            return false;
        }

        // Set RAM bank number OR upper rom bank bits
        if (byteOffset >= 0x4000 && byteOffset <= 0x5FFF) {
            this.currentHighBankValue = value << 5;

            this.copySelectedRomBankToMemory();
            this.copySelectedRamBankToMemory();
            return false;
        }

        // Change banking mode
        if (byteOffset >= 0x6000 && byteOffset <= 0x7FFF) {
            if ((value & 0x01) === 0x00) {
                this.bankingMode = BankingMode.Simple;
                
            } else if ((value & 0x01) === 0x01) {
                this.bankingMode = BankingMode.Advanced;
            }

            this.copySelectedRomBankToMemory();
            this.copySelectedRamBankToMemory();
            return false;
        }

        // Can only write to RAM if it is enabled
        if (byteOffset >= RAM_START && byteOffset <= RAM_END) {
            if (this.ramEnabled) {
                // Update local copy of RAM
                let selectedRamBank = this.getSelectedRamBank();
                if (selectedRamBank) {
                    selectedRamBank[byteOffset - RAM_START] = value;
                }
                return true;
            }

            return false;
        }

        return true;
    }
}

export default [
    MBC1
] as CartridgeType[];
