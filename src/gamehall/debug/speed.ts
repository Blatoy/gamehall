import { Clock } from "../clock.js";

const SPEED_RANGE = document.getElementById("speed-range") as HTMLInputElement;
const SPEED_INPUT = document.getElementById("speed-input") as HTMLInputElement;

export class Speed {
    constructor(private clock: Clock) {
        SPEED_RANGE.addEventListener('input', () => {
            SPEED_INPUT.value = SPEED_RANGE.value;
            this.updateSpeed();
        });
        SPEED_INPUT.addEventListener('input', () => {
            SPEED_RANGE.value = SPEED_INPUT.value;
            this.updateSpeed();
        });
    }

    updateSpeed(): void {
        this.clock.speedFactor = parseFloat(SPEED_INPUT.value);
    }
}
