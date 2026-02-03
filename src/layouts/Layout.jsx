import { Outlet, Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import TileManager from "../components/TileManager";
import InstallPrompt from "../components/InstallPrompt";
import { ALL_BOOKS } from "../constants/bibleData";
import { useSettings } from "../hooks/useSettings";
import { useMultiWindow } from "../contexts/MultiWindowContext";
import { Grid2x2, Settings } from "lucide-react";

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { book, chapter, version } = useParams();
    const { settings } = useSettings();

    const [isLeftOpen, setIsLeftOpen] = useState(false);
    const [isRightOpen, setIsRightOpen] = useState(false);
    const [isTileOpen, setIsTileOpen] = useState(false);

    const { updateActiveWindow, saveScrollPosition, activeWindowId, getActiveWindow } = useMultiWindow();
    const wrapperRef = useRef(null);


    const currentBookName = ALL_BOOKS.find(b => b.id === book)?.name || '';

    // Handle body classes for Legacy CSS layout
    useEffect(() => {
        const body = document.body;

        // Layout State
        if (isLeftOpen) {
            body.classList.add('left_open');
            body.classList.remove('right_open');
        } else {
            body.classList.remove('left_open');
        }

        if (isRightOpen) {
            body.classList.add('right_open');
            body.classList.remove('left_open');
        } else {
            body.classList.remove('right_open');
        }

        // Color Scheme
        const root = document.documentElement;
        if (version === 'krv') {
            root.style.setProperty('--color-scheme', '#00beff');
        } else {
            root.style.setProperty('--color-scheme', '#ff0044'); // Default RNKSV
        }

    }, [isLeftOpen, isRightOpen, version]);

    // Navigate handler for LeftSidebar
    const handleBookNavigation = (bookId, chapterNum) => {
        const v = version || 'rnksv';
        if (chapterNum) {
            navigate(`/${v}/${bookId}/${chapterNum}`);
            setIsLeftOpen(false);
        } else {
            document.body.classList.add('c_reading');
        }
    };

    // Close menus when clicking outside (on Main)
    const handleMainClick = () => {
        if (isLeftOpen) setIsLeftOpen(false);
        if (isRightOpen) setIsRightOpen(false);
        // Reset c_reading when closing?
        document.body.classList.remove('c_reading');
    };

    // Sync URL changes to active window state
    useEffect(() => {
        if (version && book && chapter) {
            updateActiveWindow(version, book, chapter);
        }
    }, [version, book, chapter, updateActiveWindow]);

    // Close menus on route change
    useEffect(() => {
        setIsLeftOpen(false);
        setIsRightOpen(false);
        setIsTileOpen(false);
        document.body.classList.remove('c_reading');
    }, [location.pathname]);

    // Handle tile selection → save current scroll, then navigate to that window's position
    const handleSelectWindow = (win) => {
        const wrapperEl = wrapperRef.current;
        if (wrapperEl) {
            saveScrollPosition(activeWindowId, wrapperEl.scrollTop);
        }
        navigate(`/${win.version}/${win.book}/${win.chapter}`);
    };

    const handleAddWindow = () => {
        setIsTileOpen(false);
        setIsLeftOpen(true);
    };

    // Restore scroll position when active window changes
    useEffect(() => {
        const win = getActiveWindow();
        const wrapperEl = wrapperRef.current;
        if (!wrapperEl) return;

        const savedScroll = win?.scrollTop ?? 0;
        let restored = false;

        const restore = () => {
            if (restored) return;
            wrapperEl.scrollTop = savedScroll;
            if (savedScroll === 0 || Math.abs(wrapperEl.scrollTop - savedScroll) < 2) {
                restored = true;
                observer.disconnect();
            }
        };

        // 1) 이미 콘텐츠가 렌더링된 경우 (캐시된 데이터)
        const raf = requestAnimationFrame(restore);

        // 2) 비동기 데이터 로드 후 DOM이 변경되는 경우
        const observer = new MutationObserver(restore);
        observer.observe(wrapperEl, { childList: true, subtree: true });

        // 3) 안전장치: 3초 후 정리
        const timeout = setTimeout(() => {
            observer.disconnect();
        }, 3000);

        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
            clearTimeout(timeout);
        };
    }, [activeWindowId, getActiveWindow]);


    return (
        <>
            <header>
                <div
                    className="btn left"
                    onClick={() => setIsLeftOpen(!isLeftOpen)}
                ></div>
                <div className="title">
                    {currentBookName} {chapter && `${chapter}장`}
                </div>
                <div
                    className="btn multi-window"
                    onClick={() => {
                        if (!isTileOpen) {
                            const wrapperEl = wrapperRef.current;
                            if (wrapperEl) {
                                saveScrollPosition(activeWindowId, wrapperEl.scrollTop);
                            }
                        }
                        setIsTileOpen(!isTileOpen);
                    }}
                >
                    <Grid2x2 size={20} />
                </div>
                <div
                    className="btn right"
                    onClick={() => setIsRightOpen(!isRightOpen)}
                >
                    <Settings size={20} />
                </div>
            </header>

            <div className="main" onClick={handleMainClick}>
                <div className="wrapper" ref={wrapperRef}>
                    <Outlet context={{ settings }} />
                </div>
            </div>

            <LeftSidebar
                isOpen={isLeftOpen}
                currentBook={book}
                currentChapter={chapter}
                onBookSelect={handleBookNavigation}
            />

            <RightSidebar
                isOpen={isRightOpen}
                onClose={() => setIsRightOpen(false)}
            />

            <TileManager
                isOpen={isTileOpen}
                onClose={() => setIsTileOpen(false)}
                onSelectWindow={handleSelectWindow}
                onAddWindow={handleAddWindow}
            />

            <InstallPrompt />
        </>
    );
}
