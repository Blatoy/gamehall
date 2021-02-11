import { Memory } from '../../../src/gamehall/memory.js';
import { MockCPU } from '../mock-cpu.js';

describe('AND', () => {
    let memory: Memory;
    let cpu: MockCPU;
    
    beforeEach(() => {
        memory = new Memory();
        cpu = new MockCPU(memory);
    });
    
    it('Simple', () => {
        cpu.resetRegisters({ a: 0b0011_1100, b: 0b1111_0000 });
        cpu.testInstruction('AND a,b');
        cpu.expect8BitRegisters({ a: 0b0011_0000, f: { h: 1 } });
    });
    it('Zero Flag', () => {
        cpu.resetRegisters({ a: 0b0000_0000, b: 0b0000_1111 });
        cpu.testInstruction('AND a,b');
        cpu.expect8BitRegisters({ a: 0b0000_0000, f: { h: 1, z: 1 } });
    });
    it('Operand', () => {
        cpu.resetRegisters({ a: 0b0011_1100 });
        cpu.testInstruction('AND a,d8', 0b1111_0000);
        cpu.expect8BitRegisters({ a: 0b0011_0000, f: { h: 1 } });
    });
    it('Pointer', () => {
        cpu.resetRegisters({ a: 0b0011_1100 });
        cpu.writeDataAtPC(0b1111_0000);
        cpu.testInstruction('AND a,(hl)');
        cpu.expect8BitRegisters({ a: 0b0011_0000, f: { h: 1 } });
    });
});
