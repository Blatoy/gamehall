import { Memory } from '../../../src/gamehall/memory.js';
import { MockCPU } from '../mock-cpu.js';

describe('LD', () => {
    let memory: Memory;
    let cpu: MockCPU;

    beforeEach(() => {
        memory = new Memory();
        cpu = new MockCPU(memory);
    });

    for (let register1 of ['a', 'b', 'c', 'd', 'h', 'l', '(hl)']) {
        for (let register2 of ['a', 'b', 'c', 'd', 'h', 'l', `(hl)`]) {
            
            // LD (hl),(hl) does not exists
            // LD (hl),h or LD (hl),l changes hl and is tested below
            if (register1 === '(hl)' && register2 === '(hl)' || (register1 === '(hl)' && (register2 === 'l' || register2 === 'h'))) {
                continue;
            }

            it(`${register1},${register2}`, () => {
                if (register2 === '(hl)') {
                    cpu.writeDataAtPC(0b1001_0110);
                }
                else {
                    cpu.resetRegisters({ [register2]: 0b1001_0110 });
                }

                cpu.testInstruction(`LD ${register1},${register2}`);

                if (register1 === '(hl)') {
                    if (cpu.memory.data.getUint8(0) !== 0b1001_0110) {
                        throw new Error(`Value not set properly for LD ${register1},${register2} (Got: ${cpu.memory.data.getUint8(0)})`);
                    }
                }
                else {
                    cpu.expect8BitRegisters({ [register1]: 0b1001_0110 });
                }
            });
        }
    }
});
