import { ALL_BOOKS } from "../constants/bibleData";

export function getPrevNext(version, bookId, chapter) {
    const currentBookIndex = ALL_BOOKS.findIndex(b => b.id === bookId);
    if (currentBookIndex === -1) return { prev: null, next: null };

    const currentBook = ALL_BOOKS[currentBookIndex];
    const currentChapter = parseInt(chapter);

    let prev = null;
    let next = null;

    // Previous Logic
    if (currentChapter > 1) {
        prev = `/${version}/${bookId}/${currentChapter - 1}`;
    } else if (currentBookIndex > 0) {
        const prevBook = ALL_BOOKS[currentBookIndex - 1];
        prev = `/${version}/${prevBook.id}/${prevBook.chapters}`;
    }

    // Next Logic
    if (currentChapter < currentBook.chapters) {
        next = `/${version}/${bookId}/${currentChapter + 1}`;
    } else if (currentBookIndex < ALL_BOOKS.length - 1) {
        const nextBook = ALL_BOOKS[currentBookIndex + 1];
        next = `/${version}/${nextBook.id}/1`;
    }

    return { prev, next };
}
