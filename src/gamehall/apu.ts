import { ParameterName } from "./apu-worklets.js";
import { Memory } from "./memory.js";
import { toHex } from "./utils.js";

export class APU {
    audioContext?: AudioContext;
    channels: AudioWorkletNode[] = [];

    private _audioEnabled = false;
    get audioEnabled(): boolean {
        return this._audioEnabled;
    }
    set audioEnabled(v: boolean) {
        this._audioEnabled = v;
        this.updatePaused();
    }

    // Emulator paused
    private _paused = true;
    get paused(): boolean {
        return this._paused;
    }
    set paused(v: boolean) {
        this._paused = v;
        this.updatePaused();
    }

    constructor(private memory: Memory) {
        this.initHooks();
    }

    initHooks() {
        this.memory.data.hooks.push((byteOffset, length, value, littleEndian) => {
            /*
            FF1A - NR30 - Channel 3 Sound on/off (R/W)
            */
            if (byteOffset === 0xff26) {
                this.audioEnabled = (value & 0b1000_0000) > 0;
            }

            if (byteOffset >= 0xFF10 && byteOffset <= 0xFF3F) {
                this.setParameter(1, 'enabled', 1);
                console.log('audio', toHex(byteOffset), "Set to", toHex(value))
            }

            return true;
        });
    }

    async load(): Promise<boolean> {
        if (this.audioContext !== undefined) {
            return false;
        }

        this.audioContext = new AudioContext({
            sampleRate: 44100
        });
        // TODO: To avoid cache sadness, Math.random() :)
        await this.audioContext.audioWorklet.addModule('./generated/scripts/gamehall/apu-worklets.js?' + Math.random());

        for (let channel = 0; channel < 4; channel++) {
            const node = new AudioWorkletNode(this.audioContext, `channel${channel + 1}`, {
                channelCount: 2,
                channelCountMode: 'max'
            });
            node.connect(this.audioContext.destination);
            this.channels.push(node);
        }

        await this.updatePaused();

        return true;
    }

    private async updatePaused() {
        if (this.audioEnabled && !this.paused) {
            await this.audioContext?.resume();
        } else {
            await this.audioContext?.suspend();
        }
    }

    setParameter(channel: number | 'all', name: ParameterName, value: number) {
        if (channel === 'all') {
            for (let channelIndex = 1; channelIndex <= 4; channelIndex++) {
                this.setParameter(channelIndex, name, value);
            }
            return;
        }

        // TODO: Better type info :)
        (this.channels[channel + 1].parameters as any).get(name).value = value;
    }

    async unload(): Promise<boolean> {
        if (this.audioContext === undefined) {
            return false;
        }

        await this.audioContext.close();
        this.channels = [];

        return true;
    }
}
