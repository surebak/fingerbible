import { useState, useEffect } from 'react';
import { OLD_TESTAMENT, NEW_TESTAMENT } from '../constants/bibleData';

export default function LeftSidebar({ isOpen, onBookSelect, currentBook, currentChapter }) {
    const [selectedBook, setSelectedBook] = useState(currentBook);

    useEffect(() => {
        if (currentBook) {
            setSelectedBook(currentBook);
        }
    }, [currentBook]);

    // When a book is clicked, we update localized state to show chapters
    // The 'c_reading' class logic is handled by parent Layout or via callback

    const handleBookClick = (bookId, e) => {
        e.stopPropagation();
        setSelectedBook(bookId);
        // Logic for sliding chapters view? 
        // In legacy, clicking a book added 'c_reading' to body.
        // We will propagate this intent
        onBookSelect(bookId);
    };

    const currentBookData = [...OLD_TESTAMENT, ...NEW_TESTAMENT].find(b => b.id === selectedBook);

    return (
        <>
            {/* Books Sidebar */}
            <div className="books">
                {/* Old Testament */}
                {OLD_TESTAMENT.map(b => (
                    <div
                        key={b.id}
                        className={selectedBook === b.id ? 'selected' : ''}
                        onClick={(e) => handleBookClick(b.id, e)}
                    >
                        {b.name}
                    </div>
                ))}
                {/* New Testament */}
                {NEW_TESTAMENT.map(b => (
                    <div
                        key={b.id}
                        className={selectedBook === b.id ? 'selected' : ''}
                        onClick={(e) => handleBookClick(b.id, e)}
                    >
                        {b.name}
                    </div>
                ))}
            </div>

            {/* Chapters Drawer */}
            <div className="chapters">
                {currentBookData && Array.from({ length: currentBookData.chapters }, (_, i) => i + 1).map(ch => (
                    <li
                        key={ch}
                        className={parseInt(currentChapter) === ch ? 'selected' : ''}
                        onClick={() => onBookSelect(selectedBook, ch)}
                    >
                        {ch}
                    </li>
                ))}
            </div>
        </>
    );
}
