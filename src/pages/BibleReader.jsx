import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useBible } from "../hooks/useBible";
import BibleText from "../components/BibleText";
import { ALL_BOOKS, VERSIONS } from "../constants/bibleData";
import NotFound from "./NotFound";


export default function BibleReader() {
    const { version, book, chapter } = useParams();

    const validVersion = VERSIONS.some(v => v.id === version);
    const bookData = ALL_BOOKS.find(b => b.id === book);
    const chapterNum = parseInt(chapter);
    const validChapter = bookData && Number.isInteger(chapterNum) && chapterNum >= 1 && chapterNum <= bookData.chapters;

    const isValid = validVersion && bookData && validChapter;

    const { data, loading, error } = useBible(version, book);

    // Save last read
    useEffect(() => {
        if (isValid) {
            localStorage.setItem('fingerbible-last-read', JSON.stringify({
                version, book, chapter
            }));
        }
    }, [version, book, chapter, isValid]);

    if (!isValid) {
        return <NotFound />;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                데이터를 불러오는 중 오류가 발생했습니다.<br />
                {error.message}
            </div>
        );
    }

    return (
        <BibleText data={data} chapter={chapter} />
    );
}
