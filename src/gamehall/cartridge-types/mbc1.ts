import { CartridgeController } from '../cartridge-controller.js';
import { RAM_END, RAM_SIZE, RAM_START, SWITCHABLE_BANK_END, Cartridge, CartridgeType } from '../cartridge.js';

const RAM_BANK_COUNT = 3;

class MBC1 implements Cartridge {
    constructor(private controller: CartridgeController) { }

    static get code(): number {
        return 0x01;
    }
    
    ramEnabled = false;
    ramBuffer = new ArrayBuffer(RAM_BANK_COUNT * RAM_SIZE);
    ram = new Uint8Array(this.ramBuffer);
    disabledRam = new Uint8Array(new Array(RAM_SIZE).fill(0xFF));
    selectedRamBank = 1;

    load(): void {
        // Load banks 0 and 1
        this.controller.loadIntoMemory(0, 0, SWITCHABLE_BANK_END);
        // Load FF into RAM as it is disabled by default
        this.controller.cpu.memory.writeUint8Array(this.disabledRam, RAM_START);
    }

    onMemoryWrite(byteOffset: number, length: number, value: number, littleEndian?: boolean): boolean {
        /*
        Read from $0000 – $3FFF
        Default mapped as bank 0. Can be swapped out with specific other banks based on “mode”. See the Mapping section.

        Read from $4000 – $7FFF
        Default mapped as bank 1. Can be swapped out with most other banks. See the Mapping section.

        Read from $A000 – $BFFF
        External RAM. Access is disabled by default. Disabled reads are pulled high ($FF).
        */
        /*
            MBC1 bank swapping is a bit unusual due to the fact that it has a high bank and a low bank that combine to make the actual bank number. The high and low bank are combined as such to arrive at the bank number for the $4000 region bank:
        */
        // LO % MAPPING_SIZE + (HI % 4) * MAPPING_SIZE
        if (byteOffset <= 0x1FFF) {
            // TODO
            let shouldEnableAccess = (0x0A & value) === 0x0A;
            console.log("Setting ram access to ", shouldEnableAccess);
            throw new Error("MBC1 not finished yet");
            
            // Enable or disable external RAM access. Writing a value of $xA enables access, whereas any other value disables access. The high nybble is ignored.
            return false;
        }

        if (byteOffset >= 0x2000 && byteOffset <= 0x3FFF) {
            console.log("Setting low bank value");
            throw new Error("MBC1 not finished yet");

            // TODO
            // Set the low bank value; see the Mapping section. It cannot be zero and will be coerced to 1 if a value of 0 is written.
            return false;
        }

        if (byteOffset >= 0x4000 && byteOffset <= 0x5FFF) {
            console.log("Setting high bank value");
            throw new Error("MBC1 not finished yet");

            // TODO
            // Set the high bank value; see the Mapping section. This instead controls the external RAM bank when in RAM mode.
            return false;
        }

        if (byteOffset >= 0x6000 && byteOffset <= 0x7FFF) {
            console.log("Adjustating mode");
            throw new Error("MBC1 not finished yet");

            // TODO
            // Adjust mode based on the least significant bit. Writing %…1 enables “external RAM mode” which allows swapping the RAM bank and the bank at $0000. Writing %…0 disables RAM mode and switches the RAM and $0000 ROM banks back to 0.
            return false;
        }

        // Can only write to RAM if it's enabled
        if (byteOffset >= RAM_START && byteOffset <= RAM_END) {
            console.log("Writing to ram");
            throw new Error("MBC1 not finished yet");
            
            return this.ramEnabled;
        }

        return true;
    }
}

export default [
    MBC1
] as CartridgeType[];