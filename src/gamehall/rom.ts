export type ROMName = `${string}.gb`;

export namespace ROM {
    export async function load(name: ROMName): Promise<ArrayBuffer> {
        const result = await fetch('./roms/' + name);
        if (!result.ok) {
            throw new Error('ROM ' + name + ' could not be loaded.');
        }
        return result.arrayBuffer();
    }
}
