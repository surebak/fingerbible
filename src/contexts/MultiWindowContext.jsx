import { createContext, useState, useContext, useCallback } from 'react';

export const MultiWindowContext = createContext(null);

const STORAGE_KEY = 'fingerbible-windows';

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function loadFromStorage() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved && saved.windows?.length > 0 && saved.activeWindowId) {
            return saved;
        }
    } catch {}
    return null;
}

function saveToStorage(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function MultiWindowProvider({ children }) {
    const [state, setState] = useState(() => {
        const saved = loadFromStorage();
        if (saved) return saved;

        // Try to initialize from last-read position
        let initial = { version: 'rnksv', book: 'gen', chapter: '1' };
        try {
            const lastRead = JSON.parse(localStorage.getItem('fingerbible-last-read'));
            if (lastRead?.version && lastRead?.book && lastRead?.chapter) {
                initial = lastRead;
            }
        } catch {}

        const id = generateId();
        return {
            windows: [{ id, ...initial }],
            activeWindowId: id,
        };
    });

    const getActiveWindow = useCallback(() => {
        return state.windows.find(w => w.id === state.activeWindowId) || state.windows[0];
    }, [state]);

    const updateActiveWindow = useCallback((version, book, chapter) => {
        setState(prev => {
            const next = {
                ...prev,
                windows: prev.windows.map(w =>
                    w.id === prev.activeWindowId
                        ? { ...w, version, book, chapter }
                        : w
                ),
            };
            saveToStorage(next);
            return next;
        });
    }, []);

    const saveScrollPosition = useCallback((windowId, scrollTop) => {
        setState(prev => {
            const next = {
                ...prev,
                windows: prev.windows.map(w =>
                    w.id === windowId ? { ...w, scrollTop } : w
                ),
            };
            saveToStorage(next);
            return next;
        });
    }, []);

    const addWindow = useCallback(() => {
        const id = generateId();
        const newWindow = { id, version: 'rnksv', book: 'gen', chapter: '1' };
        setState(prev => {
            const next = {
                windows: [...prev.windows, newWindow],
                activeWindowId: id,
            };
            saveToStorage(next);
            return next;
        });
        return newWindow;
    }, []);

    const removeWindow = useCallback((windowId) => {
        setState(prev => {
            if (prev.windows.length <= 1) return prev;
            const filtered = prev.windows.filter(w => w.id !== windowId);
            const activeId = prev.activeWindowId === windowId
                ? filtered[0].id
                : prev.activeWindowId;
            const next = { windows: filtered, activeWindowId: activeId };
            saveToStorage(next);
            return next;
        });
    }, []);

    const setActiveWindow = useCallback((windowId) => {
        setState(prev => {
            const next = { ...prev, activeWindowId: windowId };
            saveToStorage(next);
            return next;
        });
    }, []);

    return (
        <MultiWindowContext.Provider value={{
            windows: state.windows,
            activeWindowId: state.activeWindowId,
            getActiveWindow,
            updateActiveWindow,
            addWindow,
            removeWindow,
            setActiveWindow,
            saveScrollPosition,
        }}>
            {children}
        </MultiWindowContext.Provider>
    );
}

export function useMultiWindow() {
    const ctx = useContext(MultiWindowContext);
    if (!ctx) throw new Error('useMultiWindow must be used within MultiWindowProvider');
    return ctx;
}
