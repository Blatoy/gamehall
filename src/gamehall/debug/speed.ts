import { Clock } from "../clock.js";

const speedRange = document.getElementById("speed-range") as HTMLInputElement;
const speedInput = document.getElementById("speed-input") as HTMLInputElement;

export class Speed {
    constructor(private clock: Clock) {
        speedRange.addEventListener('input', () => {
            speedInput.value = speedRange.value;
            this.updateSpeed();
        });
        speedInput.addEventListener('input', () => {
            speedRange.value = speedInput.value;
            this.updateSpeed();
        });
    }

    updateSpeed(): void {
        this.clock.speedFactor = parseFloat(speedInput.value);
    }
}
