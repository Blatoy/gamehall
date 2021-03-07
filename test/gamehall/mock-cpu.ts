import { CPU, ExecuteInstructionResult, FlagName, RegisterName, SortedInstructions } from "../../src/gamehall/cpu.js";
import { Instruction, InstructionExecuteOutput } from "../../src/gamehall/instruction.js";
import { Pointer8, Pointer16 } from "../../src/gamehall/pointer.js";

export type RegisterValues = Omit<{
    [name in RegisterName]?: number;
}, 'f'> & {
    f?: FlagValues;
};
export type RegisterExpectedValues = Omit<{
    [name in RegisterName]?: number | null;
}, 'f'> & {
    f?: FlagExpectedValues | null;
};
export type FlagValues = {
    [name in FlagName]?: number | boolean;
}
export type FlagExpectedValues = {
    [name in FlagName]?: number | boolean | null;
}

const IGNORE_8_BIT_REGISTER_EXPECTATIONS: RegisterExpectedValues = {
    a: null,
    b: null,
    c: null,
    d: null,
    e: null,
    f: null,
    h: null,
    l: null
};
const IGNORE_16_BIT_REGISTER_EXPECTATIONS: RegisterExpectedValues = {
    af: null,
    bc: null,
    de: null,
    hl: null,
    pc: null,
    sp: null
};

export class MockCPU extends CPU {
    lastRegisters?: RegisterValues;

    /** Sets register values. Undefined is 0 (or 0xfffe for the stack pointer). */
    resetRegisters(values: RegisterValues = {}) {
        this.registers.reset();
        values = { sp: 0xfffe, ...values };
        for (const name of Object.keys(values) as RegisterName[]) {
            const register: Pointer8 | Pointer16 = this.registers[name];
            const value = values[name]!;
            if (typeof value === 'object') {
                // Set flag bits
                for (const flag of Object.keys(value) as FlagName[]) {
                    const flagValue = value[flag]!;
                    if (flagValue) {
                        this.flags[flag].set();
                    }
                }
                continue;
            }

            // TODO: Allow setting endianness for 16-bit pointers? Also better negative number support?
            //if (value < 0) {
            //    register.setInt(value);
            //} else {
                register.setUint(value);
            //}
        }
        this.lastRegisters = values;
    }

    /** Sets stack to the given values, with the first item lying at the stack pointer, growing backwards. */
    setStack(...values: number[]) {
        this.memory.write(this.registers.sp.getUint() - values.length, values);
    }

    /** Null = I don't care about this, undefined = I expect it to be unchanged (exceptions are pc, sp, af) */
    expectRegisters(values: RegisterExpectedValues = {}) {
        // Don't compare PC, SP, AF by default
        values = { pc: null, sp: null, af: null, ...values };

        for (const name of this.getRegisterNames()) {
            let expectedValue = values[name];
            if (expectedValue === undefined) {
                // Expect unchanged, or 0 if never set
                expectedValue = this.lastRegisters?.[name] || 0;
            } else if (expectedValue === null) {
                continue;
            } else if (typeof expectedValue === 'object') {
                // Expect flag bits
                for (const flagName of this.getFlagNames() as FlagName[]) {
                    let expectedFlagValue = expectedValue[flagName];
                    if (expectedFlagValue === undefined) {
                        // Expect unchanged, or 0 if never set
                        expectedFlagValue = this.lastRegisters?.f?.[flagName] || false;
                    } else if (expectedFlagValue === null) {
                        continue;
                    }

                    if (typeof expectedFlagValue === 'number') {
                        expectedFlagValue = expectedFlagValue === 1;
                    }

                    const currentFlagValue = this.flags[flagName].get();
                    if (currentFlagValue !== expectedFlagValue) {
                        throw new Error('Flag ' + flagName + ' has value ' + currentFlagValue + ' but expected ' + expectedFlagValue);
                    }
                }
                continue;
            }

            // TODO: Allow setting endianness for 16-bit pointers? Also better negative number support?
            let currentValue: number;
            //if (expectedValue < 0) {
                currentValue = this.registers[name].getUint();
            //} else {
            //    currentValue = this.registers[name].getInt();
            //}

            if (currentValue !== expectedValue) {
                throw new Error('Register ' + name + ' has value ' + currentValue + ' but expected ' + expectedValue);
            }
        }
    }

    /** Null = I don't care about this, undefined = I expect it to be unchanged */
    expect8BitRegisters(values: RegisterExpectedValues = {}) {
        this.expectRegisters({ ...IGNORE_16_BIT_REGISTER_EXPECTATIONS, ...values });
    }

    /** Null = I don't care about this, undefined = I expect it to be unchanged */
    expect16BitRegisters(values: RegisterExpectedValues = {}) {
        this.expectRegisters({ ...IGNORE_8_BIT_REGISTER_EXPECTATIONS, ...values });
    }

    private findInstructionByName(name: string, parentInstructions: SortedInstructions): Instruction | undefined {
        // Breadth first search
        const nested: SortedInstructions[] = [];
        for (const parent of parentInstructions) {
            if (parent === null) {
                continue;
            } else if (Array.isArray(parent)) {
                nested.push(parent);
            } else if (parent.name === name) {
                return parent;
            }
        }
        for (const child of nested) {
            const result = this.findInstructionByName(name, child);
            if (result !== undefined) {
                return result;
            }
        }
        return undefined;
    }

    private findInstruction(instruction: string | number | number[]): Instruction | undefined {
        if (typeof instruction === 'string') {
            return this.findInstructionByName(instruction, this.instructions);
        } else if (typeof instruction === 'number') {
            instruction = [instruction];
        }

        let parentInstructions = this.instructions;
        for (const opCode of instruction) {
            const instructionOrList = parentInstructions[opCode];
            if (instructionOrList === null) {
                return undefined;
            } else if (Array.isArray(instructionOrList)) {
                // We hit an extended instruction - dig deeper into the list
                parentInstructions = instructionOrList;
            } else {
                return instructionOrList;
            }
        }

        throw new Error('Specified an incomplete extended instruction ' + instruction);
    }

    /** Run specified instruction in context of a test. */
    testInstruction(instruction: string | number | number[], ...dataAtPC: number[]): ExecuteInstructionResult {
        const instructionRef = this.findInstruction(instruction);
        if (instructionRef === undefined) {
            throw new Error('Instruction ' + instruction + ' could not be found.');
        }

        this.writeDataAtPC(...dataAtPC);
        return this.executeInstruction(instructionRef, -1);
    }

    /** Put specified data at program counter (0x0000 by default), then tries to run the instruction that's there. */
    testInstructionRaw(...dataAtPC: number[]): InstructionExecuteOutput {
        this.writeDataAtPC(...dataAtPC);
        return this.executeInstructionFromMemory().result!;
    }

    /** Directly write bytes at the program counter. */
    writeDataAtPC(...data: number[]) {
        this.memory.write(this.registers.pc.getUint(), data);
    }
}
