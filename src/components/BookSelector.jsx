import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { OLD_TESTAMENT, NEW_TESTAMENT, ALL_BOOKS } from '../constants/bibleData';

export default function BookSelector({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { version = 'rnksv', book: currentBook, chapter: currentChapter } = useParams();

    const [selectedBook, setSelectedBook] = useState(null);

    if (!isOpen) return null;

    const handleBookSelect = (bookId) => {
        setSelectedBook(ALL_BOOKS.find(b => b.id === bookId));
    };

    const handleChapterSelect = (chapter) => {
        navigate(`/${version}/${selectedBook.id}/${chapter}`);
        onClose();
        setSelectedBook(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/50 pointer-events-auto backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl h-[90vh] sm:h-[80vh] pointer-events-auto flex flex-col shadow-2xl overflow-hidden animate-slide-up">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">
                        {selectedBook ? selectedBook.name : '성경 선택'}
                    </h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {!selectedBook ? (
                        <div className="p-4 space-y-6">
                            {/* Old Testament */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">구약</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {OLD_TESTAMENT.map(b => (
                                        <button
                                            key={b.id}
                                            onClick={() => handleBookSelect(b.id)}
                                            className={`p-3 text-sm rounded-xl font-medium transition-colors ${currentBook === b.id
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {b.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* New Testament */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">신약</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {NEW_TESTAMENT.map(b => (
                                        <button
                                            key={b.id}
                                            onClick={() => handleBookSelect(b.id)}
                                            className={`p-3 text-sm rounded-xl font-medium transition-colors ${currentBook === b.id
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {b.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4">
                            <button
                                onClick={() => setSelectedBook(null)}
                                className="mb-4 text-sm text-gray-500 flex items-center hover:text-blue-600"
                            >
                                ← 뒤로가기
                            </button>
                            <div className="grid grid-cols-5 gap-3">
                                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(ch => (
                                    <button
                                        key={ch}
                                        onClick={() => handleChapterSelect(ch)}
                                        className="aspect-square flex items-center justify-center rounded-full text-lg font-medium bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        {ch}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
