import { Instruction, InstructionDefinition, InstructionExecuteOutput, NotImplementedError } from "./instruction.js";
import InstructionList from './instructions/index.js';
import { Binch } from "../binch/binch.js";
import { Memory } from "./memory.js";
import { CarryFlag, HalfCarryFlag, Flag, ZeroFlag } from "./cpu.flag.js";
import { Pointer16, Pointer8 } from "./pointer.js";

/**
 * Duration of one clock cycle (in ms).
 * 
 * Machine Cycles: 1.05MHz = 1 050 000 Hz
 * Clock Cycles:   4.19MHz = 4 190 000 Hz
 */
const CPU_CYCLE_SPEED = 1000 / 4_190_000;

export class CPU {

    private readonly instructions: SortedInstructions;

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
        b: new Pointer8(this.registerData, 11)
    };

    /** z n h c */
    readonly flags = {
        /** Carry on last bit occurred -or- for CP, if register A < n. */
        c: new CarryFlag(this.registers.f, 4),
        /** Carry on 4th bit occurred. */
        h: new HalfCarryFlag(this.registers.f, 5),
        /** Last operation was negative. */
        n: new Flag(this.registers.f, 6),
        /** Last operation resulted in zero. */
        z: new ZeroFlag(this.registers.f, 7),
        /** Reset all flags to 0. */
        reset: () => {
            this.registers.f.setUint(0);
        }
    };

    constructor(private memory: Memory) {
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

    /**
     * Gets the instruction at the given byte offset, without changing the CPU's state.
     */
    getInstruction(byteOffset: number): InstructionInformation {
        const result: InstructionInformation = { opCode: [], instruction: undefined };

        // Start at "root level" instructions
        let parentInstructions = this.instructions;
        while (true) {
            const opCode = this.memory.data.getUint8(byteOffset++);
            result.opCode.push(opCode);

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
            console.log(`Cannot keep up! Did the system time change or is the server overloaded? Running ${duration - this.maxExecutionTime}ms behind`);
            duration = this.maxExecutionTime;
        }
        
        const clockCycleDuration = CPU_CYCLE_SPEED * this.speedFactor;
        while (duration > 0) {
            // TODO: Check interrupt

            const { instruction, result } = this.executeInstruction();
            if (result.clockCycles <= 0) {
                console.error('Instruction', instruction.name, 'returned invalid clock cycles', result.clockCycles);
                result.clockCycles = 1;
            }
            duration -= result.clockCycles * clockCycleDuration;
        }
    }

    private executeInstruction(): { instruction: Instruction, result: InstructionExecuteOutput} {
        const pcValue = this.registers.pc.getUint();
        const { opCode, instruction } = this.getInstruction(pcValue);
        this.registers.pc.setUint(pcValue + opCode.length);

        if (instruction === undefined) {
            throw new NotImplementedError('Unknown instruction opcode ' + opCode);
        }

        return { instruction, result: instruction.execute(this) };
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
}

export type RegisterName = keyof CPU['registers'];

type WritableSortedInstructions = Array<Instruction | WritableSortedInstructions | null>;
type SortedInstructions = ReadonlyArray<Instruction | WritableSortedInstructions | null>;

export interface InstructionInformation {
    opCode: number[];
    instruction: Instruction | undefined;
}
