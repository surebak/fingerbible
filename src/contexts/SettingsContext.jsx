import { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
    fontSize: 18,
    theme: 'dark', // Legacy default is Dark
    keepScreenOn: false,
};

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('fingerbible-settings');
            return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
        } catch {
            return DEFAULT_SETTINGS;
        }
    });

    useEffect(() => {
        localStorage.setItem('fingerbible-settings', JSON.stringify(settings));

        // Apply Theme Classes to Body
        const body = document.body;
        if (settings.theme === 'light') {
            body.classList.add('bright');
        } else {
            body.classList.remove('bright');
        }

        // Note: We do NOT apply font-size to root/body because legacy only resized the text area.
        // Applying to root would break sidebar layout (em based).

    }, [settings]);

    const updateSettings = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}
