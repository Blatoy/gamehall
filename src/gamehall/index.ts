import { Clock } from "./clock.js";
import { CPU, MACHINE_CYCLE_SPEED } from "./cpu.js";
import { Debug } from "./debug/debug.js";
import { GPU } from "./gpu.js";
import { addDocumentListener } from "./hotkeys.js";
import { Memory } from "./memory.js";
import { CartridgeController } from "./cartridge.js";
import { Screen } from './screen.js';
import { Controller } from "./controller.js";

async function main() {
    const memory = new Memory();
    memory.init();

    const cartridgeController = new CartridgeController(memory);
    await cartridgeController.initialize('boot-rom.gb', 'tetris.gb');

    const cpu = new CPU(memory);
    const gpu = new GPU(memory);
    const clock = new Clock(cpu, gpu);
    const screen = new Screen(document.getElementById("game-screen") as HTMLCanvasElement);
    const controller = new Controller(memory);
    const debug = new Debug(cpu, gpu, screen, clock);

    gpu.renderedFrameHooks.push((imgData) => screen.renderFrame(imgData));

    debug.addHotkeyListener();
    controller.addHotkeyListener();
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
        // So we have to wait ("sleep") for the excess time beyond 1 machine cycle's length
        const machineCycleLength = MACHINE_CYCLE_SPEED / clock.speedFactor;
        const waitTime = duration <= 0 ? 0 : Math.max(0, machineCycleLength - duration);
        if (waitTime > 0) {
            setTimeout(() => window.requestAnimationFrame(time => tick(time)), waitTime);
        } else {
            window.requestAnimationFrame(time => tick(time));
        }
    }

    window.requestAnimationFrame(time => tick(time));
}

main();
