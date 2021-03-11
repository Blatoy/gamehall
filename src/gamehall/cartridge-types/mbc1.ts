import { CartridgeController } from '../cartridge-controller.js';
import { RAM_END, RAM_SIZE, RAM_START, SWITCHABLE_BANK_END, Cartridge, CartridgeType, SWITCHABLE_BANK_SIZE, SWITCHABLE_BANK_START } from '../cartridge.js';

const RAM_BANK_COUNT = 3;

enum BankingMode {
    Simple,
    Advanced
}

class MBC1 implements Cartridge {
    bankingMode = BankingMode.Simple;
    ramEnabled = false;
    selectedRamBank = 0;
    ramBuffer = new ArrayBuffer(RAM_BANK_COUNT * RAM_SIZE);
    ram = new Uint8Array(this.ramBuffer);
    cartridgeBankCount = 0;

    constructor(private controller: CartridgeController) {
        this.cartridgeBankCount = controller.gameROM!.uint8Array.byteLength / SWITCHABLE_BANK_SIZE;
    }

    static get code(): number {
        return 0x01;
    }

    // TODO: Have this shared to save on memory?
    private disabledRam = new Uint8Array(new Array(RAM_SIZE).fill(0xFF));

    load(): void {
        // Load banks 0 and 1
        this.controller.loadIntoMemory(0, 0, SWITCHABLE_BANK_END, "game");
        // Load FF into RAM as it is disabled by default
        this.controller.cpu.memory.writeUint8Array(this.disabledRam, RAM_START);
    }

    private handleRAMBankSwap() {
        if (this.ramEnabled) {
            // Replace FF by what is in ram
            this.controller.cpu.memory.writeUint8Array(this.ram.slice(RAM_SIZE * this.selectedRamBank, RAM_SIZE * (1 + this.selectedRamBank)), RAM_START);
        } else {
            // Save selected RAM
            this.ram.set(this.controller.cpu.memory.uint8Array.slice(RAM_START, RAM_END + 1), RAM_SIZE * this.selectedRamBank);
            // Replace RAM with FF
            this.controller.cpu.memory.writeUint8Array(this.disabledRam, RAM_START);
        }
    }

    onMemoryWrite(byteOffset: number, length: number, value: number, littleEndian?: boolean): boolean {
        // Enable or disable external RAM access
        if (byteOffset <= 0x1FFF) {
            
            this.ramEnabled = (0x0A & value) === 0x0A;
            // Note: debugging logs are kept until advanced mode is implemented
            // console.log("changing ram status to", this.ramEnabled);
            this.handleRAMBankSwap();
            return false;
        }

        // Set the low bank value (which is bank number in normal mode)
        if (byteOffset >= 0x2000 && byteOffset <= 0x3FFF) {
            let mask = Math.min(0b0001_1111,  Math.pow(2, (Math.floor(Math.log2(value)) + 1)) - 1); // This could be cached

            // console.log("Trying to switch to bank", toHex(value), "fixed bank number =", toHex(value & mask), "PC: ", this.controller.cpu.registers.pc.getUint());
            value = mask & value;

            if (value === 0x00 || value === 0x20 || value === 0x40 || value === 0x60) {
                value += 1;
            }

            if (this.bankingMode === BankingMode.Advanced) {    
                throw new Error("MBC1: advanced banking mode not supported yet");
            }
            else {
                // console.log("Switching to bank", value, "/", this.cartridgeBankCount, "starting at", toHex(SWITCHABLE_BANK_SIZE * value), "ending at", toHex(SWITCHABLE_BANK_SIZE * (value + 1) - 1), "writing it at", toHex(SWITCHABLE_BANK_START));
                
                let memoryBank = this.controller.gameROM!.uint8Array.slice(SWITCHABLE_BANK_SIZE * value, SWITCHABLE_BANK_SIZE * (value + 1) - 1);
                this.controller.cpu.memory.write(SWITCHABLE_BANK_START, memoryBank);
            }

            return false;
        }

        // Set RAM bank number OR upper rom bank bits
        if (byteOffset >= 0x4000 && byteOffset <= 0x5FFF) {
            if (this.bankingMode === BankingMode.Advanced) {
                // TODO: To implement advanced mode store rom bank number and adjust its higher bit
                throw new Error("MBC1: advanced banking mode not supported yet");
            }
            else {
                console.log("setting ram bank number to", value);
                
                // TODO: This should check that value is not higher than what's available!
                this.selectedRamBank = value;
                this.handleRAMBankSwap();
            }

            return false;
        }

        // Change banking mode
        if (byteOffset >= 0x6000 && byteOffset <= 0x7FFF) {
            if (value === 0x00) {
                // console.log("change banking mode");
                
                this.bankingMode = BankingMode.Simple;
            }
            else {
                // TODO: Support advanced banking mode
                throw new Error("MBC1: advanced banking mode not supported yet");
            }

            return false;
        }

        // Can only write to RAM if it's enabled
        if (byteOffset >= RAM_START && byteOffset <= RAM_END) {
            
            return this.ramEnabled;
        }

        return true;
    }
}

class MBC1_RAM_BATTERY extends MBC1 {
    static get code(): number {
        return 0x13;
    }

    // TODO: Ram persistence using local storage?
}

export default [
    MBC1,
    MBC1_RAM_BATTERY
] as CartridgeType[];