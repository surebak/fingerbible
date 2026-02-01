import { useMemo } from 'react';

import { useOutletContext } from "react-router-dom";

export default function BibleText({ data, chapter }) {
    const { settings } = useOutletContext() || {}; // Context might be null if not provided

    const verses = useMemo(() => {
        if (!data) return [];

        // key formats are "1", "2", etc.
        const chapterKey = `c${chapter}`;
        const chapterData = data[chapterKey];

        if (!chapterData) return [];

        // Sort verses numerically
        return Object.keys(chapterData)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(verseNum => ({
                num: verseNum,
                text: chapterData[verseNum]
            }));
    }, [data, chapter]);

    if (!verses.length) {
        return (
            <div className="p-8 text-center text-gray-500">
                말씀이 없습니다. (No text found for {chapter}장)
            </div>
        );
    }

    return (
        <div className="text" style={{ fontSize: `${settings?.fontSize || 18}px` }}> {/* Font size logic needs to be passed or handled via global CSS */}
            {verses.map((verse) => (
                <div key={verse.num}>
                    <span>{verse.num}</span>
                    <p>{verse.text}</p>
                </div>
            ))}
        </div>
    );
}
