import { hotkeyListeners } from "./hotkeys.js";
import { Memory } from "./memory.js";

const CONTROLLER_ADDRESS = 0xFF00;

enum ControllerButton {
    A = 0b0001,
    B = 0b0010,
    Select = 0b0100,
    Start = 0b1000,
}

enum ControllerPad {
    Right = 0b0001,
    Left = 0b0010,
    Up = 0b0100,
    Down = 0b1000,
}

enum InputType {
    Button,
    Pad
}

enum ReadType {
    Buttons = 0b0010_0000,
    Pad = 0b0001_0000,
    Both = 0b0011_0000,
    None = 0b0000_0000
}

type ControllerInput = ControllerButton | ControllerPad;

export class Controller {
    // 0 => not pressed, 1 => pressed (this is inverted when writing to memory)
    // TODO: May change this to match gameboy behavior to avoid all the "NOT"s ?
    buttonsState = 0b0000;
    padState = 0b0000;

    constructor(private memory: Memory) {
        this.initHooks();
        this.updateControllerState();
    }

    addHotkeyListener() {
        hotkeyListeners.push((hotkey, released) => {
            switch (hotkey) {
                case 'controller-a':
                    this.setButtonState(ControllerButton.A, InputType.Button, released);
                    break;
                case 'controller-b':
                    this.setButtonState(ControllerButton.B, InputType.Button, released);
                    break;
                case 'controller-start':
                    this.setButtonState(ControllerButton.Start, InputType.Button, released);
                    break;
                case 'controller-select':
                    this.setButtonState(ControllerButton.Select, InputType.Button, released);
                    break;
                case 'controller-up':
                    this.setButtonState(ControllerPad.Up, InputType.Pad, released);
                    break;
                case 'controller-down':
                    this.setButtonState(ControllerPad.Down, InputType.Pad, released);
                    break;
                case 'controller-left':
                    this.setButtonState(ControllerPad.Left, InputType.Pad, released);
                    break;
                case 'controller-right':
                    this.setButtonState(ControllerPad.Right, InputType.Pad, released);
                    break;
            }
        });
    }

    setButtonState(button: ControllerButton, type: InputType.Button, released: boolean): void;
    setButtonState(button: ControllerPad, type: InputType.Pad, released: boolean): void;
    setButtonState(button: ControllerInput, type: InputType, released: boolean): void {
        if (released) {
            switch (type) {
                case InputType.Button:
                    this.buttonsState &= ~button;
                    break;
                case InputType.Pad:
                    this.padState &= ~button;
                    break;
            }
        }
        else {
            let previouslyPressed = false;

            switch (type) {
                case InputType.Button:
                    previouslyPressed = (this.buttonsState & button) > 0;
                    this.buttonsState |= button;
                    break;
                case InputType.Pad:
                    previouslyPressed = (this.padState & button) > 0;
                    this.padState |= button;
                    break;
            }

            // JoyPad interrupt (only trigger when going from high to low.
            if (!previouslyPressed) {
                this.memory.uint8Array[0xFF0F] |= 0b0001_0000;
            }
        }

        this.updateControllerState();
    }

    /**
     * Update given memory to match button state and settings
     */
    updateControllerState(value?: ReadType) {
        if (value === undefined) {
            value = this.memory.uint8Array[CONTROLLER_ADDRESS];
        }

        this.memory.uint8Array[CONTROLLER_ADDRESS] = 0b1100_0000 | (0b0011_0000 & value);

        switch (value) {
            case ReadType.Both:
                this.memory.uint8Array[CONTROLLER_ADDRESS] |= (~this.padState) & (~this.buttonsState);
                break;
            case ReadType.Pad:
                this.memory.uint8Array[CONTROLLER_ADDRESS] |= ~this.padState;
                break;
            case ReadType.Buttons:
                this.memory.uint8Array[CONTROLLER_ADDRESS] |= ~this.buttonsState;
                break;
            case ReadType.None:
                this.memory.uint8Array[CONTROLLER_ADDRESS] |= 0b1111;
                break;
            default:
                throw new Error("Invalid read type for controller: " + value);
        }
    }

    private initHooks() {
        this.memory.data.hooks.push((byteOffset, length, value) => {
            if (byteOffset === CONTROLLER_ADDRESS) {
                this.updateControllerState(0b0011_0000 & (~value));
                return false;
            }
            return true;
        });
    }


}
