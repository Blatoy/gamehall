import { Clock } from "./clock.js";
import { CPU, CPU_CYCLE_SPEED } from "./cpu.js";
import { Debug } from "./debug/debug.js";
import { GPU } from "./gpu.js";
import { addDocumentListener } from "./hotkeys.js";
import { Memory } from "./memory.js";
import { Cartridge } from "./cartridge.js";
import { Screen } from './screen.js';

async function main() {
    const memory = new Memory();
    memory.init();

    const gameROM = new Cartridge('tetris.gb', memory);
    const bootROM = new Cartridge('boot-rom.gb', memory);
    await Promise.all([gameROM.downloadData(), bootROM.downloadData()]);
    gameROM.load();
    bootROM.loadIntoMemory(0, 0);

    Cartridge.initHooks(memory, gameROM);

    const cpu = new CPU(memory);
    const gpu = new GPU(memory);
    const clock = new Clock(cpu, gpu);
    const screen = new Screen(document.getElementById("game-screen") as HTMLCanvasElement);
    const debug = new Debug(cpu, gpu, screen, clock);

    gpu.renderedFrameHooks.push((imgData) => screen.renderFrame(imgData));

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
                if (!debug.clockPaused) {
                    duration = time - lastTime;
                    clock.tick(duration);
                }
    
                lastTime = time;
            } catch (err) {
                // TODO: DEBUG - still update debugger before cancelling loop
                debug.afterTick();
                throw err;
            }
        }

        // Debug update every tick, unless the CPU is paused
        if (!debug.clockPaused || tickCount % 10 === 0) {
            debug.afterTick();
        }

        // If speed factor is too small, while loop will still run 1 instruction per frame
        // So we have to wait ("sleep") for the excess time beyond 1 clock cycle's length
        const clockCycleLength = CPU_CYCLE_SPEED / clock.speedFactor;
        const waitTime = duration <= 0 ? 0 : Math.max(0, clockCycleLength - duration);
        if (waitTime > 0) {
            setTimeout(() => window.requestAnimationFrame(time => tick(time)), waitTime);
        } else {
            window.requestAnimationFrame(time => tick(time));
        }
    }

    window.requestAnimationFrame(time => tick(time));
}

main();
