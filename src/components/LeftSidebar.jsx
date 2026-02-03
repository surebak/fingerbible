import { useState, useEffect, useRef } from 'react';
import { OLD_TESTAMENT, NEW_TESTAMENT } from '../constants/bibleData';

export default function LeftSidebar({ isOpen, onBookSelect, currentBook, currentChapter }) {
    const [selectedBook, setSelectedBook] = useState(currentBook);
    const chaptersRef = useRef(null);
    const booksRef = useRef(null);

    useEffect(() => {
        if (currentBook) {
            setSelectedBook(currentBook);
        }
    }, [currentBook]);

    // 패널이 열릴 때 현재 책/장으로 초기화 + 책 목록 스크롤
    useEffect(() => {
        if (isOpen) {
            setSelectedBook(currentBook);
            document.body.classList.remove('c_reading');
            requestAnimationFrame(() => {
                // 현재 책이 중앙에 오도록 스크롤
                const booksContainer = booksRef.current;
                if (booksContainer && currentBook) {
                    const bookEl = booksContainer.querySelector(`[data-id="${currentBook}"]`);
                    if (bookEl) {
                        bookEl.scrollIntoView({ block: 'center', behavior: 'instant' });
                    }
                }
                // 현재 장이 중앙에 오도록 스크롤
                const chaptersContainer = chaptersRef.current;
                if (chaptersContainer && currentChapter) {
                    const chapterEl = chaptersContainer.querySelector(`[data-ch="${currentChapter}"]`);
                    if (chapterEl) {
                        chapterEl.scrollIntoView({ block: 'center', behavior: 'instant' });
                    }
                }
            });
        }
    }, [isOpen, currentBook]);

    const handleBookClick = (bookId, e) => {
        e.stopPropagation();
        setSelectedBook(bookId);
        onBookSelect(bookId);
        // 다른 책 선택 시 챕터 패널 스크롤을 맨 위로
        if (bookId !== currentBook && chaptersRef.current) {
            chaptersRef.current.scrollTop = 0;
        }
    };

    const currentBookData = [...OLD_TESTAMENT, ...NEW_TESTAMENT].find(b => b.id === selectedBook);

    return (
        <>
            {/* Books Sidebar */}
            <div className="books" ref={booksRef}>
                {/* Old Testament */}
                {OLD_TESTAMENT.map(b => (
                    <div
                        key={b.id}
                        data-id={b.id}
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
                        data-id={b.id}
                        className={selectedBook === b.id ? 'selected' : ''}
                        onClick={(e) => handleBookClick(b.id, e)}
                    >
                        {b.name}
                    </div>
                ))}
            </div>

            {/* Chapters Drawer */}
            <div className="chapters" ref={chaptersRef}>
                {currentBookData && Array.from({ length: currentBookData.chapters }, (_, i) => i + 1).map(ch => (
                    <li
                        key={ch}
                        data-ch={ch}
                        className={(selectedBook === currentBook ? parseInt(currentChapter) : 1) === ch ? 'selected' : ''}
                        onClick={() => onBookSelect(selectedBook, ch)}
                    >
                        {ch}
                    </li>
                ))}
            </div>
        </>
    );
}
