interface Hotkey {
    name: string;
    keys: Shortcut[];
}

interface Shortcut {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    key: string;
}

const HOTKEYS: Hotkey[] = [
    {
        name: 'step',
        keys: [
            { key: 'Numpad6' }
        ]
    },
    {
        name: 'pause',
        keys: [
            { key: 'Numpad5' }
        ]
    },
    {
        name: 'display-type-binary',
        keys: [
            { key: 'Numpad7' }
        ]
    },
    {
        name: 'display-type-hex',
        keys: [
            { key: 'Numpad8' }
        ]
    },
    {
        name: 'display-type-decimal',
        keys: [
            { key: 'Numpad9' }
        ]
    },
    {
        name: 'reset-rom',
        keys: [
            { key: 'NumpadDecimal' }
        ]
    }
];

export const hotkeyListeners: ((hotkeyName: string) => void)[] = [];

export function addDocumentListener(): void {
    document.addEventListener('keydown', (ev) => {
        const hotkey = HOTKEYS.find(h => h.keys.find(k =>
            (k.ctrl || false) === ev.ctrlKey &&
            (k.shift || false) === ev.shiftKey &&
            (k.alt || false) === ev.altKey &&
            k.key === ev.code
        ));
    
        if (hotkey) {
            for (const listener of hotkeyListeners) {
                listener(hotkey.name);
            }
        }
    });
}
