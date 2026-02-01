import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const lastRead = JSON.parse(localStorage.getItem('fingerbible-last-read'));
            if (lastRead && lastRead.version && lastRead.book && lastRead.chapter) {
                navigate(`/${lastRead.version}/${lastRead.book}/${lastRead.chapter}`, { replace: true });
                return;
            }
        } catch (e) {
            console.error(e);
        }

        // Default
        navigate("/rnksv/gen/1", { replace: true });
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
    );
}
