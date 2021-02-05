import { CPU } from "./cpu.js";
import { Memory } from "./memory.js";
import { ROM } from "./rom.js";

async function main() {
    const memory = new Memory();
    const bootROM = await ROM.load('boot-rom.gb');
    memory.write(0, new Uint8Array(bootROM));
    const cpu = new CPU(memory);

    let lastTime: number | undefined;
    function tick(time: number) {
        if (lastTime === undefined) {
            lastTime = time;
        } else {
            cpu.tickCPU(time - lastTime);
        }

        window.requestAnimationFrame(time => tick(time));
    }

    window.requestAnimationFrame(time => tick(time));
}

main();
