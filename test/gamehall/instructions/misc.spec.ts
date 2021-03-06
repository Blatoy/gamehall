import { Memory } from '../../../src/gamehall/memory.js';
import { MockCPU } from '../mock-cpu.js';

describe('MISC', () => {
    let memory: Memory;
    let cpu: MockCPU;
    
    beforeEach(() => {
        memory = new Memory();
        cpu = new MockCPU(memory);
    });
    
    it('CPL', () => {
        cpu.resetRegisters({ a: 0b0011_1100 });
        cpu.testInstruction('CPL');
        cpu.expect8BitRegisters({ a: 0b1100_0011, f: { n: 1, h: 1} });
        
    });

    it('CPL with negative', () => {
        cpu.resetRegisters({ a: 0b1011_1101 });
        cpu.testInstruction('CPL');
        cpu.expect8BitRegisters({ a: 0b0100_0010, f: { n: 1, h: 1} });
    });

    it('SCF', () => {
        cpu.resetRegisters({f: {z: 1, n: 1, h: 1, c: 0}});
        cpu.testInstruction('SCF');
        cpu.expect8BitRegisters({f: {z: 1, n: 0, h: 0, c: 1}});
    });

    it('EI', () => {
        cpu.resetRegisters();
        cpu.testInstruction('EI');
        
        if (cpu.interruptMasterEnableFlag) {
            throw new Error("Interrupt master enable flag should not be enabled instantly!");
        }

        if (!cpu.queueInterruptMasterEnableFlag) {
            throw new Error("Interrupt master enable flag is not queued!");
        }
        
        cpu.testInstruction('NOP');

        if (!cpu.interruptMasterEnableFlag) {
            throw new Error("Interrupt master enable flag was not set after one instruction!");
        }

        if (cpu.queueInterruptMasterEnableFlag) {
            throw new Error("Interrupt master enable flag should not be queued after one instruction!");
        }
    });

    it('EI DI instant', () => {
        cpu.resetRegisters();
        cpu.testInstruction('EI');
        
        if (cpu.interruptMasterEnableFlag) {
            throw new Error("Interrupt master enable flag should not be enabled instantly!");
        }

        if (!cpu.queueInterruptMasterEnableFlag) {
            throw new Error("Interrupt master enable flag is not queued!");
        }
        
        cpu.testInstruction('DI');

        if (cpu.interruptMasterEnableFlag) {
            throw new Error("Interrupt master enable flag should not be enabled after DI!");
        }

        if (cpu.queueInterruptMasterEnableFlag) {
            throw new Error("Interrupt master enable flag should not be queued after DI!");
        }
    });
});
