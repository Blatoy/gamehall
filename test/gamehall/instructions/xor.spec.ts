import { Memory } from '../../../src/gamehall/memory.js';
import { MockCPU } from '../mock-cpu.js';

describe('XOR', () => {
    let memory: Memory;
    let cpu: MockCPU;
    
    beforeEach(() => {
        memory = new Memory();
        cpu = new MockCPU(memory);
    });
    
    it('Simple', () => {
        cpu.resetRegisters({ a: 0b1010_1010, b: 0b0101_0101 });
        cpu.testInstruction('XOR a,b');
        cpu.expect8BitRegisters({ a: 0b1111_1111 });
    });
    it('Zero Flag', () => {
        cpu.resetRegisters({ a: 0b0011_1100, b: 0b0011_1100 });
        cpu.testInstruction('XOR a,b');
        cpu.expect8BitRegisters({ a: 0b0000_0000, f: { z: 1 } });
    });
    it('Operand', () => {
        cpu.resetRegisters({ a: 0b1010_1010 });
        cpu.testInstruction('XOR a,d8', 0b0101_0101);
        cpu.expect8BitRegisters({ a: 0b1111_1111 });
    });
    it('Pointer', () => {
        cpu.resetRegisters({ a: 0b1010_1010 });
        cpu.writeDataAtPC(0b0101_0101);
        cpu.testInstruction('XOR a,(hl)');
        cpu.expect8BitRegisters({ a: 0b1111_1111 });
    });
});
