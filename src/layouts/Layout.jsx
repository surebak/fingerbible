import { Outlet, Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import TileManager from "../components/TileManager";
import { ALL_BOOKS } from "../constants/bibleData";
import { useSettings } from "../hooks/useSettings";
import { useMultiWindow } from "../contexts/MultiWindowContext";

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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="9" height="9" rx="1" />
                        <rect x="13" y="2" width="9" height="9" rx="1" />
                        <rect x="2" y="13" width="9" height="9" rx="1" />
                        <rect x="13" y="13" width="9" height="9" rx="1" />
                    </svg>
                </div>
                <div
                    className="btn right"
                    onClick={() => setIsRightOpen(!isRightOpen)}
                >
                    {/* Copying the SVG from legacy */}
                    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px" y="0px" viewBox="0 0 478.703 478.703" style={{ enableBackground: "new 0 0 478.703 478.703" }}
                        xmlSpace="preserve">
                        <path d="M454.2,189.101l-33.6-5.7c-3.5-11.3-8-22.2-13.5-32.6l19.8-27.7c8.4-11.8,7.1-27.9-3.2-38.1l-29.8-29.8
            c-5.6-5.6-13-8.7-20.9-8.7c-6.2,0-12.1,1.9-17.1,5.5l-27.8,19.8c-10.8-5.7-22.1-10.4-33.8-13.9l-5.6-33.2
            c-2.4-14.3-14.7-24.7-29.2-24.7h-42.1c-14.5,0-26.8,10.4-29.2,24.7l-5.8,34c-11.2,3.5-22.1,8.1-32.5,13.7l-27.5-19.8
            c-5-3.6-11-5.5-17.2-5.5c-7.9,0-15.4,3.1-20.9,8.7l-29.9,29.8c-10.2,10.2-11.6,26.3-3.2,38.1l20,28.1
            c-5.5,10.5-9.9,21.4-13.3,32.7l-33.2,5.6c-14.3,2.4-24.7,14.7-24.7,29.2v42.1c0,14.5,10.4,26.8,24.7,29.2l34,5.8
            c3.5,11.2,8.1,22.1,13.7,32.5l-19.7,27.4c-8.4,11.8-7.1,27.9,3.2,38.1l29.8,29.8c5.6,5.6,13,8.7,20.9,8.7c6.2,0,12.1-1.9,17.1-5.5
            l28.1-20c10.1,5.3,20.7,9.6,31.6,13l5.6,33.6c2.4,14.3,14.7,24.7,29.2,24.7h42.2c14.5,0,26.8-10.4,29.2-24.7l5.7-33.6
            c11.3-3.5,22.2-8,32.6-13.5l27.7,19.8c5,3.6,11,5.5,17.2,5.5l0,0c7.9,0,15.3-3.1,20.9-8.7l29.8-29.8c10.2-10.2,11.6-26.3,3.2-38.1
            l-19.8-27.8c5.5-10.5,10.1-21.4,13.5-32.6l33.6-5.6c14.3-2.4,24.7-14.7,24.7-29.2v-42.1
            C478.9,203.801,468.5,191.501,454.2,189.101z M451.9,260.401c0,1.3-0.9,2.4-2.2,2.6l-42,7c-5.3,0.9-9.5,4.8-10.8,9.9
            c-3.8,14.7-9.6,28.8-17.4,41.9c-2.7,4.6-2.5,10.3,0.6,14.7l24.7,34.8c0.7,1,0.6,2.5-0.3,3.4l-29.8,29.8c-0.7,0.7-1.4,0.8-1.9,0.8
            c-0.6,0-1.1-0.2-1.5-0.5l-34.7-24.7c-4.3-3.1-10.1-3.3-14.7-0.6c-13.1,7.8-27.2,13.6-41.9,17.4c-5.2,1.3-9.1,5.6-9.9,10.8l-7.1,42
            c-0.2,1.3-1.3,2.2-2.6,2.2h-42.1c-1.3,0-2.4-0.9-2.6-2.2l-7-42c-0.9-5.3-4.8-9.5-9.9-10.8c-14.3-3.7-28.1-9.4-41-16.8
            c-2.1-1.2-4.5-1.8-6.8-1.8c-2.7,0-5.5,0.8-7.8,2.5l-35,24.9c-0.5,0.3-1,0.5-1.5,0.5c-0.4,0-1.2-0.1-1.9-0.8l-29.8-29.8
            c-0.9-0.9-1-2.3-0.3-3.4l24.6-34.5c3.1-4.4,3.3-10.2,0.6-14.8c-7.8-13-13.8-27.1-17.6-41.8c-1.4-5.1-5.6-9-10.8-9.9l-42.3-7.2
            c-1.3-0.2-2.2-1.3-2.2-2.6v-42.1c0-1.3,0.9-2.4,2.2-2.6l41.7-7c5.3-0.9,9.6-4.8,10.9-10c3.7-14.7,9.4-28.9,17.1-42
            c2.7-4.6,2.4-10.3-0.7-14.6l-24.9-35c-0.7-1-0.6-2.5,0.3-3.4l29.8-29.8c0.7-0.7,1.4-0.8,1.9-0.8c0.6,0,1.1,0.2,1.5,0.5l34.5,24.6
            c4.4,3.1,10.2,3.3,14.8,0.6c13-7.8,27.1-13.8,41.8-17.6c5.1-1.4,9-5.6,9.9-10.8l7.2-42.3c0.2-1.3,1.3-2.2,2.6-2.2h42.1
            c1.3,0,2.4,0.9,2.6,2.2l7,41.7c0.9,5.3,4.8,9.6,10,10.9c15.1,3.8,29.5,9.7,42.9,17.6c4.6,2.7,10.3,2.5,14.7-0.6l34.5-24.8
            c0.5-0.3,1-0.5,1.5-0.5c0.4,0,1.2,0.1,1.9,0.8l29.8,29.8c0.9,0.9,1,2.3,0.3,3.4l-24.7,34.7c-3.1,4.3-3.3,10.1-0.6,14.7
            c7.8,13.1,13.6,27.2,17.4,41.9c1.3,5.2,5.6,9.1,10.8,9.9l42,7.1c1.3,0.2,2.2,1.3,2.2,2.6v42.1H451.9z" />
                        <path
                            d="M239.4,136.001c-57,0-103.3,46.3-103.3,103.3s46.3,103.3,103.3,103.3s103.3-46.3,103.3-103.3S296.4,136.001,239.4,136.001
            z M239.4,315.601c-42.1,0-76.3-34.2-76.3-76.3s34.2-76.3,76.3-76.3s76.3,34.2,76.3,76.3S281.5,315.601,239.4,315.601z" />
                    </svg>
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
            />
        </>
    );
}
