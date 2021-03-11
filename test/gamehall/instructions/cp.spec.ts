import { Memory } from '../../../src/gamehall/memory.js';
import { MockCPU } from '../mock-cpu.js';

describe('CP', () => {
    let memory: Memory;
    let cpu: MockCPU;
    
    beforeEach(() => {
        memory = new Memory();
        cpu = new MockCPU(memory);
    });
    
    for (let register of ['a', 'b', 'c', 'd', 'h', 'l']) {
        it('Simple ' + register, () => {
            cpu.resetRegisters({ a: 0b0000_0010, [register]: 0b0000_0010 });
            cpu.testInstruction('CP ' + register);
            cpu.expect8BitRegisters({ f: {z: 1, n: 1} });
        });
    }

    for (let register of ['b', 'c', 'd', 'h', 'l']) {
        it('Carry set for ' + register, () => {
            cpu.resetRegisters({ a: 0b0010_0000, [register]: 0b0100_0000 });
            cpu.testInstruction('CP ' + register);
            cpu.expect8BitRegisters({ f: {z: 0, n: 1, c: 1} });
        });
    }

    for (let register of ['b', 'c', 'd', 'h', 'l']) {
        it('Carry set for ' + register, () => {
            cpu.resetRegisters({ a: 0b0100_0000, [register]: 0b0010_0000 });
            cpu.testInstruction('CP ' + register);
            cpu.expect8BitRegisters({ f: {z: 0, n: 1, c: 0} });
        });
    }

    for (let register of ['b', 'c', 'd', 'h', 'l']) {
        it('Half carry & carry' + register, () => {
            cpu.resetRegisters({ a: 0b0000_1000, [register]: 0b0000_1100 });
            cpu.testInstruction('CP ' + register);
            cpu.expect8BitRegisters({ f: {z: 0, n: 1, c: 1, h: 1} });
        });
    }


    it('d8', () => {
        for (let i = 0x00; i < 0xFF; i++) {
            cpu.resetRegisters({ a: i });
            cpu.testInstruction('CP d8', i);
            cpu.expect8BitRegisters({ f: {z: 1, n: 1} });
        }
    });

    it('d8 carry', () => {
        cpu.resetRegisters({ a: 0b0010_0000 });
        cpu.testInstruction('CP d8', 0b0001_0000);
        cpu.expect8BitRegisters({ f: {z: 0, n: 1, c: 0} });
    });

    it('d8 carry set', () => {
        cpu.resetRegisters({ a: 0b0010_0000 });
        cpu.testInstruction('CP d8', 0b0100_0000);
        cpu.expect8BitRegisters({ f: {z: 0, n: 1, c: 1} });
    });

    it('d8 half carry and carry set', () => {
        cpu.resetRegisters({ a: 0b0000_1000 });
        cpu.testInstruction('CP d8', 0b0000_1100);
        cpu.expect8BitRegisters({ f: {z: 0, n: 1, c: 1, h: 1} });
    });

});
