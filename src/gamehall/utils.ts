export function toHex(value: number, padding = 1, prefix = '0x'): string {
    return prefix + value.toString(16).padStart(padding * 2, '0');
}

export function toBinary(value: number, padding = 1): string {
    let str = value.toString(2).padStart(padding * 8, '0');
    for (let i = 0; i < padding * 2 - 1; i++) {
        let spaceIndex = 5 * i + 4;
        str = str.substr(0, spaceIndex) + " " + str.substr(spaceIndex);
    }
    return str;
}

export function executeHooks(hooks: ((...args: any[]) => any)[], ...args: any[]): void {
    for (const hook of hooks) {
        hook(...args);
    }
}
