import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useBible } from "../hooks/useBible";
import BibleText from "../components/BibleText";
import { getPrevNext } from "../utils/bibleUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function BibleReader() {
    const { version, book, chapter } = useParams();
    const { data, loading, error } = useBible(version, book);
    const { prev, next } = getPrevNext(version, book, chapter);

    // Save last read
    useEffect(() => {
        if (version && book && chapter) {
            localStorage.setItem('fingerbible-last-read', JSON.stringify({
                version, book, chapter
            }));
        }
    }, [version, book, chapter]);

    // Scroll to top on navigation
    // Note: Layout handles scroll, but we might need window scrollTo if full page reload happens, 
    // currently React Router handles it but Layout overflow might keep scroll pos.
    // We'll rely on user manually scrolling or implement specific scroll-to-top logic in Layout/here if needed.

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
