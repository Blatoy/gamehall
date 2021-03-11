interface Hotkey {
    name: string;
    keys: Shortcut[];
    triggerOnRelease?: boolean;
}

interface Shortcut {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    key: string;
}

const hotkeys: Hotkey[] = [
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
    },
    {
        name: 'controller-a',
        triggerOnRelease: true,
        keys: [{ key: 'KeyZ' }, { key: 'KeyY' }]
    },
    {
        name: 'controller-b',
        triggerOnRelease: true,
        keys: [{ key: 'KeyX' }]
    },
    {
        name: 'controller-start',
        triggerOnRelease: true,
        keys: [{ key: 'KeyS' }]
    },
    {
        name: 'controller-select',
        triggerOnRelease: true,
        keys: [{ key: 'KeyA' }]
    },
    {
        name: 'controller-up',
        triggerOnRelease: true,
        keys: [{ key: 'ArrowUp' }]
    },
    {
        name: 'controller-down',
        triggerOnRelease: true,
        keys: [{ key: 'ArrowDown' }]
    },
    {
        name: 'controller-left',
        triggerOnRelease: true,
        keys: [{ key: 'ArrowLeft' }]
    },
    {
        name: 'controller-right',
        triggerOnRelease: true,
        keys: [{ key: 'ArrowRight' }]
    }
];

export const hotkeyListeners: ((hotkeyName: string, released: boolean) => void)[] = [];

export function addDocumentListener(): void {
    document.addEventListener('keydown', (ev) => {
        const hotkey = hotkeys.find(h => h.keys.find(k =>
            (k.ctrl || false) === ev.ctrlKey &&
            (k.shift || false) === ev.shiftKey &&
            (k.alt || false) === ev.altKey &&
            k.key === ev.code
        ));

        if (hotkey) {
            for (const listener of hotkeyListeners) {
                listener(hotkey.name, false);
            }
            ev.preventDefault();
        }
    });

    document.addEventListener('keyup', (ev) => {
        const hotkey = hotkeys.find(h => h.keys.find(k => k.key === ev.code));

        if (hotkey && hotkey.triggerOnRelease) {
            for (const listener of hotkeyListeners) {
                listener(hotkey.name, true);
            }
            ev.preventDefault();
        }
    });
}
