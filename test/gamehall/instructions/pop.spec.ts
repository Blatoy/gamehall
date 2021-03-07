import { Memory } from '../../../src/gamehall/memory.js';
import { MockCPU } from '../mock-cpu.js';

describe('POP', () => {
    let memory: Memory;
    let cpu: MockCPU;
    
    beforeEach(() => {
        memory = new Memory();
        cpu = new MockCPU(memory);
    });
    
    it('Simple 16-bit', () => {
        cpu.resetRegisters({ d: 0b0011_1100, e: 0b1111_0000, sp: 0x1000 });
        cpu.testInstruction('PUSH de');
        cpu.testInstruction('POP de');
        cpu.expect8BitRegisters({ sp: undefined });

        cpu.resetRegisters({ d: 0b0011_1100, e: 0b1111_0000, sp: 0x1000 });
        cpu.testInstruction('PUSH de');
        cpu.testInstruction('POP hl');
        cpu.expect8BitRegisters({ h: 0b0011_1100, l: 0b1111_0000, sp: undefined });
    });
});
