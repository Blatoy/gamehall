import { CPU } from "./cpu.js";
import { Debug } from "./debug/debug.js";
import { Memory } from "./memory.js";
import { ROM } from "./rom.js";

async function main() {
    const memory = new Memory();
    const bootROM = await ROM.load('boot-rom.gb');
    memory.write(0, new Uint8Array(bootROM));
    const cpu = new CPU(memory);
    const debug = new Debug(cpu);

    let lastTime: number | undefined;
    function tick(time: number) {
        if (lastTime === undefined) {
            lastTime = time;
        } else {
            try {
                // TODO: DEBUG - execute only a single instruction at a time
                //(cpu as any).executeInstruction();
                cpu.tickCPU(time - lastTime);
            } catch (err) {
                // TODO: DEBUG - still update debugger before cancelling loop
                debug.afterTick();
                throw err;
            }
            debug.afterTick();
        }

        // TODO: If the time delta (after speedFactor dilation and subtracting machine cycle count) is still positive, then sleep for that duration
        //       to avoid a "minimum execution speed" of your screen's refresh rate (e.g. 60Hz)

        window.requestAnimationFrame(time => tick(time));
    }

    window.requestAnimationFrame(time => tick(time));
}

main();
