import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useBible } from "../hooks/useBible";
import { useSEO } from "../hooks/useSEO";
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

    const versionData = VERSIONS.find(v => v.id === version);
    const versionName = versionData ? versionData.name : '';
    const bookName = bookData ? bookData.name : '';

    const jsonLd = useMemo(() => {
        if (!isValid) return null;
        return {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${bookName} ${chapter}장 - 손가락 성경`,
            "description": `${bookName} ${chapter}장 (${versionName}) - 손가락 성경에서 읽기`,
            "url": `https://fingerbible.com/${version}/${book}/${chapter}`,
            "about": {
                "@type": "Book",
                "name": bookName,
                "bookEdition": versionName,
                "inLanguage": "ko",
            },
            "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://fingerbible.com" },
                    { "@type": "ListItem", "position": 2, "name": versionName, "item": `https://fingerbible.com/${version}/gen/1` },
                    { "@type": "ListItem", "position": 3, "name": bookName, "item": `https://fingerbible.com/${version}/${book}/1` },
                    { "@type": "ListItem", "position": 4, "name": `${chapter}장` },
                ],
            },
        };
    }, [isValid, bookName, versionName, version, book, chapter]);

    useSEO({
        title: isValid ? `${bookName} ${chapter}장 (${versionName}) - 손가락 성경` : '손가락 성경',
        description: isValid
            ? `${bookName} ${chapter}장을 ${versionName}으로 온라인에서 무료로 읽어보세요. 손가락 성경.`
            : '온라인 무료 성경 읽기',
        path: isValid ? `/${version}/${book}/${chapter}` : '/',
        jsonLd,
        keywords: isValid
            ? `${bookName}, ${bookName} ${chapter}장, ${versionName}, 성경, 온라인 성경`
            : undefined,
    });

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
