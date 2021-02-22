import { CPU } from "../cpu.js";
import { Instruction } from "../instruction.js";

const returnCodes: Instruction[] = [
    {
        code: 0xC0,
        name: 'RET nz',
        execute: (cpu: CPU) => {
            const retAddr = cpu.stackPop16();
            if (cpu.flags.z.get() === false) {
                cpu.jump(retAddr.getUint());
                return { machineCycles: 5 };
            }
            return { machineCycles: 2 };
        }
    },
    {
        code: 0xC8,
        name: 'RET z',
        execute: (cpu: CPU) => {
            const retAddr = cpu.stackPop16();
            if (cpu.flags.z.get() === true) {
                cpu.jump(retAddr.getUint());
                return { machineCycles: 5 };
            }
            return { machineCycles: 2 };
        }
    },
    {
        code: 0xC9,
        name: 'RET',
        execute: (cpu: CPU) => {
            const retAddr = cpu.stackPop16();
            cpu.jump(retAddr.getUint());
            return { machineCycles: 4 };
        }
    },
    {
        code: 0xD0,
        name: 'RET nc',
        execute: (cpu: CPU) => {
            const retAddr = cpu.stackPop16();
            if (cpu.flags.c.get() === false) {
                cpu.jump(retAddr.getUint());
                return { machineCycles: 5 };
            }
            return { machineCycles: 2 };
        }
    },
    {
        code: 0xD8,
        name: 'RET c',
        execute: (cpu: CPU) => {
            const retAddr = cpu.stackPop16();
            if (cpu.flags.c.get() === true) {
                cpu.jump(retAddr.getUint());
                return { machineCycles: 5 };
            }
            return { machineCycles: 2 };
        }
    },
    {
        code: 0xD9,
        name: 'RETI',
        execute: (cpu: CPU) => {
            cpu.interruptMasterEnableFlag = true;
            const retAddr = cpu.stackPop16();
            cpu.jump(retAddr.getUint());
            return { machineCycles: 4 };
        }
    }
];

export default returnCodes;
