import { CPU } from "./cpu.js";

/**
 * Base type for all instructions in memory.
 */
export interface BaseInstruction {
    /**
     * Display name for debugging.
     */
    name: string;
    /**
     * Opcode (index in instructions array).
     */
    code: number;
    /**
     * Optional description of instruction for debugging.
     */
    comment?: string;
}

/**
 * Instruction that can be executed.
 */
export interface Instruction extends BaseInstruction {
    /**
     * Execution function.
     */
    execute: InstructionExecute;
}

/**
 * Extended instruction containing "child" instructions.
 */
export interface ExtendedInstruction extends BaseInstruction {
    extendedInstructions: ReadonlyArray<InstructionDefinition>;
}

/**
 * All types that can be used to define an instruction.
 */
export type InstructionDefinition = Instruction | ExtendedInstruction;

export namespace Instruction {
    export function isExtended(instruction: BaseInstruction): instruction is ExtendedInstruction {
        return 'extendedInstructions' in instruction;
    }
}

export type InstructionExecute = (cpu: CPU) => InstructionExecuteOutput;

export interface InstructionExecuteOutput {
    clockCycles: number;
}

/**
 * If any executable instruction is defined but some of its functionality is not yet implemented,
 * this error can be thrown to identify it accordingly.
 */
export class NotImplementedError extends Error { }
