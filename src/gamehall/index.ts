import { CPU } from "./cpu.js";
import { Debug } from "./debug/debug.js";
import { Memory } from "./memory.js";
import { ROM } from "./rom.js";

async function main() {
    const memory = new Memory();
    memory.init();

    const bootROM = await ROM.load('boot-rom.gb');
    memory.write(0, new Uint8Array(bootROM));

    const cpu = new CPU(memory);
    const debug = new Debug(cpu);

    let tickCount = 0;
    let lastTime: number | undefined;
    function tick(time: number) {
        tickCount++;

        if (lastTime === undefined) {
            lastTime = time;
        } else {
            try {
                // TODO: DEBUG - execute only a single instruction at a time
                // (cpu as any).executeInstruction();
                if (!debug.CPUPaused) {
                    cpu.tickCPU(time - lastTime);
                }
    
                lastTime = time;
            } catch (err) {
                // TODO: DEBUG - still update debugger before cancelling loop
                debug.afterTick();
                throw err;
            }
        }

        // Debug update every tick, unless the CPU is paused
        // TODO: Make scrolling smoother because Blatoy wants it
        if (!debug.CPUPaused || tickCount % 10 === 0) {
            debug.afterTick();
        }

        window.requestAnimationFrame(time => tick(time));
    }

    window.requestAnimationFrame(time => tick(time));
}

main();


// 0ms          10ms               20ms                 30ms
// clock100     clock100           clock100             clock100

/*
    delta => how many clock cycles do we need to run
    
    while(we still have clockcycle to perform OR max time reached) {

    }

    // took 20ms
    // wait 80%
    // 

*/

/*
delta = 2000


*/
