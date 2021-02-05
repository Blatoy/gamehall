export type ROMName = `${string}.gb`;

export namespace ROM {
    export async function load(name: ROMName): Promise<ArrayBuffer> {
        const result = await fetch('./roms/' + name);
        return result.arrayBuffer();
    }
}
