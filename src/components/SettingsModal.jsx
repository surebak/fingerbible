import { X, Moon, Sun, Type, Monitor } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, updateSettings }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-sm mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">설정</h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Font Size Control */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                            <Type className="w-4 h-4" /> 글자 크기
                        </label>
                        <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl p-2">
                            <button
                                onClick={() => updateSettings('fontSize', Math.max(12, settings.fontSize - 2))}
                                className="p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all"
                            >
                                A-
                            </button>
                            <div className="flex-1 text-center font-bold text-gray-700 dark:text-gray-200">
                                {settings.fontSize}px
                            </div>
                            <button
                                onClick={() => updateSettings('fontSize', Math.min(32, settings.fontSize + 2))}
                                className="p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all"
                            >
                                A+
                            </button>
                        </div>
                        {/* Preview Text */}
                        <p className="mt-3 text-center text-gray-600 dark:text-gray-400 leading-relaxed"
                            style={{ fontSize: `${settings.fontSize}px` }}>
                            태초에 하나님이 천지를 창조하시니라
                        </p>
                    </div>

                    <hr className="border-gray-100 dark:border-gray-800" />

                    {/* Theme Control */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                            <Monitor className="w-4 h-4" /> 화면 모드
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => updateSettings('theme', 'light')}
                                className={`p-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${settings.theme === 'light'
                                        ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 ring-offset-2'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
                                    }`}
                            >
                                <Sun className="w-5 h-5" /> 라이트
                            </button>
                            <button
                                onClick={() => updateSettings('theme', 'dark')}
                                className={`p-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${settings.theme === 'dark'
                                        ? 'bg-gray-800 text-white ring-2 ring-gray-600 ring-offset-2'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
                                    }`}
                            >
                                <Moon className="w-5 h-5" /> 다크
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
