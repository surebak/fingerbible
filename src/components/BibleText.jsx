import { useMemo, useState, useCallback, useEffect } from 'react';

import { useOutletContext, useParams } from "react-router-dom";
import { ALL_BOOKS } from "../constants/bibleData";
import { Copy, X, Check } from "lucide-react";

export default function BibleText({ data, chapter }) {
    const { settings } = useOutletContext() || {};
    const { version, book } = useParams();
    const [selectedVerses, setSelectedVerses] = useState(new Set());
    const [copied, setCopied] = useState(false);

    const bookName = ALL_BOOKS.find(b => b.id === book)?.name || book;

    // 장이 바뀌면 선택 초기화
    useEffect(() => {
        setSelectedVerses(new Set());
        setCopied(false);
    }, [chapter, book, version]);

    const verses = useMemo(() => {
        if (!data) return [];

        const chapterKey = `c${chapter}`;
        const chapterData = data[chapterKey];

        if (!chapterData) return [];

        return Object.keys(chapterData)
            .sort((a, b) => parseInt(a.replace('v', '')) - parseInt(b.replace('v', '')))
            .map(verseNum => ({
                num: verseNum,
                text: chapterData[verseNum]
            }));
    }, [data, chapter]);

    const handleVerseClick = useCallback((verseNum) => {
        setSelectedVerses(prev => {
            const next = new Set(prev);
            if (next.has(verseNum)) {
                next.delete(verseNum);
            } else {
                next.add(verseNum);
            }
            return next;
        });
        setCopied(false);
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedVerses(new Set());
        setCopied(false);
    }, []);

    const handleCopy = useCallback(async () => {
        const sorted = [...selectedVerses]
            .sort((a, b) => parseInt(a.replace('v', '')) - parseInt(b.replace('v', '')));

        const verseNums = sorted.map(v => v.replace('v', ''));
        const verseRange = verseNums.length === 1
            ? verseNums[0]
            : `${verseNums[0]}-${verseNums[verseNums.length - 1]}`;

        const reference = `${bookName} ${chapter}:${verseRange}`;

        const text = sorted
            .map(vNum => {
                const verse = verses.find(v => v.num === vNum);
                return verse ? `${vNum.replace('v', '')} ${verse.text}` : '';
            })
            .filter(Boolean)
            .join('\n');

        const copyText = `${reference}\n${text}`;

        try {
            await navigator.clipboard.writeText(copyText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const textarea = document.createElement('textarea');
            textarea.value = copyText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [selectedVerses, verses, bookName, chapter]);

    if (!verses.length) {
        return (
            <div className="p-8 text-center text-gray-500">
                말씀이 없습니다. (No text found for {chapter}장)
            </div>
        );
    }

    const isSelecting = selectedVerses.size > 0;

    return (
        <>
            <div className="text" style={{ fontSize: `${settings?.fontSize || 18}px` }}>
                {verses.map((verse) => (
                    <div
                        key={verse.num}
                        className={selectedVerses.has(verse.num) ? 'on' : ''}
                        onClick={() => handleVerseClick(verse.num)}
                    >
                        <span>{verse.num.replace('v', '')}</span>
                        <p>{verse.text}</p>
                    </div>
                ))}
            </div>

            {isSelecting && (
                <div className="verse-toolbar">
                    <button className="verse-toolbar-btn" onClick={handleClearSelection}>
                        <X size={18} />
                    </button>
                    <span className="verse-toolbar-count">{selectedVerses.size}절 선택</span>
                    <button className="verse-toolbar-btn copy" onClick={handleCopy}>
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        <span>{copied ? '복사됨' : '복사'}</span>
                    </button>
                </div>
            )}
        </>
    );
}
