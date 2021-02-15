import { CPU, CPU_CYCLE_SPEED } from "./cpu.js";
import { Debug } from "./debug/debug.js";
import { addDocumentListener } from "./hotkeys.js";
import { Memory } from "./memory.js";
import { ROM } from "./rom.js";

async function main() {
    const memory = new Memory();
    memory.init();

    const gameROM = await ROM.load('tetris.gb');
    memory.write(0, new Uint8Array(gameROM));
    const bootROM = await ROM.load('boot-rom.gb');
    memory.write(0, new Uint8Array(bootROM));

    const cpu = new CPU(memory);
    const debug = new Debug(cpu);

    debug.addHotkeyListener();
    addDocumentListener();

    let tickCount = 0;
    let lastTime: number | undefined;
    function tick(time: number) {
        tickCount++;

        let duration = 0;
        if (lastTime === undefined) {
            lastTime = time;
        } else {
            try {
                // TODO: DEBUG - execute only a single instruction at a time
                // (cpu as any).executeInstruction();
                if (!debug.CPUPaused) {
                    duration = time - lastTime;
                    cpu.tickCPU(duration);
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

        const waitTime = duration <= 0 ? 0 : Math.max(0, CPU_CYCLE_SPEED / cpu.speedFactor - duration);
        if (waitTime > 0) {
            setTimeout(() => window.requestAnimationFrame(time => tick(time)), waitTime);
        } else {
            window.requestAnimationFrame(time => tick(time));
        }
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
