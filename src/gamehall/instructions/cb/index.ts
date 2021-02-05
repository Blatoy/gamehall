import { ExtendedInstruction } from "../../instruction.js";
import BIT from './bit.js';
import RES from './res.js';
import ROTATE from './rotate.js';
import ROTATE_CARRY from './rotate-carry.js';
import SET from './set.js';
import SHIFT from './shift.js';
import SWAP from './swap.js';

export default [{
    name: 'CB',
    code: 0xCB,
    extendedInstructions: [
        ...BIT,
        ...RES,
        ...ROTATE,
        ...ROTATE_CARRY,
        ...SET,
        ...SHIFT,
        ...SWAP,
    ]
} as ExtendedInstruction];
