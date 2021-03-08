// TODO: Actual imports :)
declare var AudioWorkletProcessor: any;
declare var registerProcessor: any;
declare var currentTime: number;
declare var currentFrame: number;
declare var sampleRate: number;

export type ParameterName = 'enabled' | 'masterVolume';

interface ParameterDescriptor {
    name: ParameterName;
    defaultValue: number;
    minValue: number;
    maxValue: number;
    automationRate?: 'a-rate' | 'k-rate';
}

/** Audio channel 1 */
class QuadWaveSweepProcessor extends AudioWorkletProcessor {
    counter = 0;

    constructor() {
        super();
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: { [key: string]: Float32Array }): boolean {
        const output = outputs[0];

        for (let channelIndex = 0; channelIndex < output.length; channelIndex++) {
            const channel = output[channelIndex];
            for (let frame = 0; frame < channel.length; frame++) {
                // Depends on a-rate or k-rate
                const enabled = parameters['enabled'].length > 1 ? parameters['enabled'][frame] : parameters['enabled'][0];
                const masterVolume = parameters['masterVolume'].length > 1 ? parameters['masterVolume'][frame] : parameters['masterVolume'][0];

                channel[frame] = Math.sin(this.counter) * enabled * masterVolume;
                this.counter += 10000 / sampleRate;
            }
        }

        return true;
    }

    static get parameterDescriptors(): ParameterDescriptor[] {
        return [{
            name: 'enabled',
            defaultValue: 0,
            minValue: 0,
            maxValue: 1,
            automationRate: 'a-rate'
        }, {
            name: 'masterVolume',
            defaultValue: 0.2,
            minValue: 0,
            maxValue: 1,
            automationRate: 'a-rate'
        }];
    }
}

/** Audio channel 2 */
class QuadWaveProcessor extends AudioWorkletProcessor {

}

/** Audio channel 3 */
class RawWaveProcessor extends AudioWorkletProcessor {

}

/** Audio channel 4 */
class NoiseProcessor extends AudioWorkletProcessor {

}

registerProcessor('channel1', QuadWaveSweepProcessor as any);
registerProcessor('channel2', QuadWaveSweepProcessor as any);
registerProcessor('channel3', QuadWaveSweepProcessor as any);
registerProcessor('channel4', QuadWaveSweepProcessor as any);
/*
registerProcessor('channel2', QuadWaveProcessor as any);
registerProcessor('channel3', RawWaveProcessor as any);
registerProcessor('channel4', NoiseProcessor as any);
*/
