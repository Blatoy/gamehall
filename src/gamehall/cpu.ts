import { Instruction, InstructionDefinition, InstructionExecuteOutput, NotImplementedError } from "./instruction.js";
import InstructionList from './instructions/index.js';
import { Binch } from "../binch/binch.js";
import { Memory } from "./memory.js";
import { CarryFlag, HalfCarryFlag, NegativeFlag, ZeroFlag } from "./cpu.flag.js";
import { Pointer16, Pointer8 } from "./pointer.js";
import { executeHooks, toHex } from "./utils.js";

/**
 * Duration of one clock cycle (in ms).
 * 
 * Machine Cycles: 1.05MHz = 1 050 000 Hz
 * Clock Cycles:   4.19MHz = 4 190 000 Hz
 */
const CPU_CYCLE_SPEED = 1000 / 4_190_000;

export class CPU {

    protected readonly instructions: SortedInstructions;

    readonly registerBuffer = new ArrayBuffer(12);
    readonly registerData = new Binch(this.registerBuffer);

    speedFactor = 1;
    /** One CPU tick may not take longer than this many milliseconds. */
    maxExecutionTime = 200;

    /**
     * @example
     * `
     * 0  1  2  3  4  5  6  7  8  9  10 11
     * pc pc sp sp l  h  f  a  e  d  c  b
     *             h__l  a__f  d__e  b__c
     * `
     */
    readonly registers = {
        /** Program Counter */
        pc: new Pointer16(this.registerData, 0),
        /** Stack Pointer */
        sp: new Pointer16(this.registerData, 2),
        hl: new Pointer16(this.registerData, 4),
        /** Accumulator and Flags */
        af: new Pointer16(this.registerData, 6),
        de: new Pointer16(this.registerData, 8),
        bc: new Pointer16(this.registerData, 10),
        l: new Pointer8(this.registerData, 4),
        h: new Pointer8(this.registerData, 5),
        /** Flags */
        f: new Pointer8(this.registerData, 6),
        /** Accumulator */
        a: new Pointer8(this.registerData, 7),
        e: new Pointer8(this.registerData, 8),
        d: new Pointer8(this.registerData, 9),
        c: new Pointer8(this.registerData, 10),
        b: new Pointer8(this.registerData, 11),
        /** Reset all registers to 0. */
        reset: () => {
            new Uint8Array(this.registerBuffer).fill(0);
        }
    };

    /** z n h c */
    readonly flags = {
        /** Carry on last bit occurred -or- for CP, if register A < n. */
        c: new CarryFlag(this.registers.f, 4),
        /** Carry on 4th bit occurred. */
        h: new HalfCarryFlag(this.registers.f, 5),
        /** Last operation was negative. */
        n: new NegativeFlag(this.registers.f, 6),
        /** Last operation resulted in zero. */
        z: new ZeroFlag(this.registers.f, 7),
        /** Reset all flags to 0. */
        reset: () => {
            this.registers.f.setUint(0);
        }
    };

    /** IME flag. */
    interruptMasterEnableFlag = false;

/** Returns true to break execution, false to continue as normal. */
    preExecuteHooks: InstructionPreExecuteHook[] = [];
    postExecuteHooks: InstructionPostExecuteHook[] = [];

    constructor(public memory: Memory) {
        this.instructions = this.buildInstructionList(InstructionList);
    }

    private buildInstructionList(instructionDefinitions: ReadonlyArray<InstructionDefinition>): WritableSortedInstructions {
        const sortedInstructions: WritableSortedInstructions = new Array(256).fill(null);

        for (const definition of instructionDefinitions) {
            if (Instruction.isExtended(definition)) {
                sortedInstructions[definition.code] = this.buildInstructionList(definition.extendedInstructions);
            } else {
                sortedInstructions[definition.code] = definition;
            }
        }

        return sortedInstructions;
    }

    getRegisterNames(): RegisterName[] {
        return Object.keys(this.registers).filter(r => r !== 'reset') as RegisterName[];
    }

    getFlagNames(): FlagName[] {
        return Object.keys(this.flags).filter(r => r !== 'reset') as FlagName[];
    }

    /**
     * Gets the instruction at the given byte offset, without changing the CPU's state.
     */
    getInstruction(byteOffset: number): InstructionInformation {
        const result: InstructionInformation = { opCodes: [], instruction: undefined };

        // Start at "root level" instructions
        let parentInstructions = this.instructions;
        while (true) {
            const opCode = this.memory.data.getUint8(byteOffset++);
            result.opCodes.push(opCode);

            const instructionOrList = parentInstructions[opCode];
            if (instructionOrList === null) {
                return result;
            } else if (Array.isArray(instructionOrList)) {
                // We hit an extended instruction - dig deeper into the list
                parentInstructions = instructionOrList;
            } else {
                result.instruction = instructionOrList;
                return result;
            }
        }
    }

    /** Executes the next number of milliseconds of clock cycles. */
    tickCPU(duration: number) {
        if (duration > this.maxExecutionTime) {
            console.warn(`Cannot keep up! Did the system time change or is the server overloaded? Running ${duration - this.maxExecutionTime}ms behind`);
            duration = this.maxExecutionTime;
        }

        const clockCycleDuration = CPU_CYCLE_SPEED / this.speedFactor;
        while (duration > 0) {
            // TODO: Check interrupt

            const { instruction, result } = this.executeInstruction();
            if (result === undefined) {
                // Execution of this instruction was cancelled
                break;
            }

            if (result.clockCycles <= 0) {
                console.error('Instruction', instruction.name, 'returned invalid clock cycles', result.clockCycles);
                result.clockCycles = 1;
            }
            duration -= result.clockCycles * clockCycleDuration;
        }
    }

    executeInstruction(): { instruction: Instruction, result?: InstructionExecuteOutput} {
        // TODO: Check interrupt
        
        const pcValue = this.registers.pc.getUint();
        const { opCodes, instruction } = this.getInstruction(pcValue);
        this.registers.pc.setUint(pcValue + opCodes.length);

        if (instruction === undefined) {
            throw new NotImplementedError('Unknown instruction opcode ' + opCodes.map(c => toHex(c)));
        }

        try {
            // Pre-exec hooks can cancel execution
            for (const hook of this.preExecuteHooks) {
                if (hook(instruction.name, pcValue)) {
                    this.registers.pc.setUint(pcValue);
                    return { instruction };
                }
            }

            const result = { instruction, result: instruction.execute(this) };
            executeHooks(this.postExecuteHooks, instruction.name, pcValue);
            return result;
        } catch (err) {
            if (err instanceof NotImplementedError) {
                throw new NotImplementedError('Not implemented instruction ' + instruction.name + ' opcode ' + opCodes.map(c => toHex(c)));
            } else {
                throw err;
            }
        }
    }

    /**
     * Get a Pointer8 into memory at specified byte offset.
     */
    pointer8(offset: number): Pointer8 {
        return new Pointer8(this.memory.data, offset);
    }

    /**
     * Get a Pointer16 into memory at specified byte offset.
     */
    pointer16(offset: number): Pointer16 {
        return new Pointer16(this.memory.data, offset);
    }

    pointerHL8(): Pointer8 {
        return this.pointer8(this.registers.hl.getUint());
    }

    pointerHL16(): Pointer16 {
        return this.pointer16(this.registers.hl.getUint());
    }

    pointerPC8(): Pointer8 {
        return this.pointer8(this.registers.pc.getUint());
    }

    pointerPC16(): Pointer16 {
        return this.pointer16(this.registers.pc.getUint());
    }

    pointerSP8(): Pointer8 {
        return this.pointer8(this.registers.sp.getUint());
    }

    pointerSP16(): Pointer16 {
        return this.pointer16(this.registers.sp.getUint());
    }

    /**
     * Get data at PC then increment PC.
     */
    next8(): Pointer8 {
        const pc = this.registers.pc;
        const pcValue = pc.getUint();
        const value = this.pointer8(pcValue);
        pc.setUint(pcValue + 1);
        return value;
    }

    /**
     * Get data at PC then increment PC.
     */
    next16(): Pointer16 {
        const pc = this.registers.pc;
        const pcValue = pc.getUint();
        const value = this.pointer16(pcValue);
        pc.setUint(pcValue + 2);
        return value;
    }

    /**
     * Does an absolute or relative jump of the program counter.
     * @returns The new location of the program counter.
     */
    jump(offset: number, relative = false): number {
        const pc = this.registers.pc;
        if (relative) {
            offset += pc.getUint();
        }

        pc.setUint(offset);
        return offset;
    }

    stackPush(value: Pointer8 | Pointer16): void {
        if (value instanceof Pointer8) {
            this.pointerSP8().setUint(value.getUint());
            this.registers.sp.setUint(this.registers.sp.getUint() - 1);
        } else {
            this.registers.sp.setUint(this.registers.sp.getUint() - 1);
            this.pointerSP16().setUint(value.getUint());
            this.registers.sp.setUint(this.registers.sp.getUint() - 1);
        }
    }

    stackPop8(): Pointer8 {
        this.registers.sp.setUint(this.registers.sp.getUint() + 1);
        return this.pointerSP8();
    }

    stackPop16(): Pointer16 {
        this.registers.sp.setUint(this.registers.sp.getUint() + 2);
        return this.pointerSP16();
    }
}

export type RegisterName = Exclude<keyof CPU['registers'], 'reset'>;
export type FlagName = Exclude<keyof CPU['flags'], 'reset'>;

type WritableSortedInstructions = Array<Instruction | WritableSortedInstructions | null>;
export type SortedInstructions = ReadonlyArray<Instruction | WritableSortedInstructions | null>;

export interface InstructionInformation {
    opCodes: number[];
    instruction: Instruction | undefined;
}

/** Returns true to break execution, false to continue as normal. */
export type InstructionPreExecuteHook = (instructionName: string, offset: number) => boolean;
export type InstructionPostExecuteHook = (instructionName: string, offset: number) => void;
