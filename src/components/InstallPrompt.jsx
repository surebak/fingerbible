import { useState, useEffect } from "react";

const DISMISS_KEY = "pwa-install-dismissed";
const DISMISS_DAYS = 7;

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isInStandaloneMode() {
    return window.matchMedia("(display-mode: standalone)").matches ||
        navigator.standalone === true;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);

    useEffect(() => {
        // 이미 설치된 앱이면 표시하지 않음
        if (isInStandaloneMode()) return;

        // 이전에 닫기한 경우 일정 기간 숨김
        const dismissed = localStorage.getItem(DISMISS_KEY);
        if (dismissed) {
            const dismissedAt = parseInt(dismissed, 10);
            const daysPassed = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
            if (daysPassed < DISMISS_DAYS) return;
        }

        // iOS Safari 감지
        if (isIOS()) {
            setShowIOSGuide(true);
            setShowBanner(true);
            return;
        }

        // Android/Desktop Chrome - beforeinstallprompt 이벤트
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            window.deferredPrompt = e;
            setShowBanner(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setShowBanner(false);
        }
        setDeferredPrompt(null);
        window.deferredPrompt = null;
    };

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem(DISMISS_KEY, Date.now().toString());
    };

    if (!showBanner) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.banner}>
                <div style={styles.content}>
                    <div style={styles.iconWrap}>
                        <img src="/icon-192.png" alt="손가락 성경" style={styles.icon} />
                    </div>
                    <div style={styles.textWrap}>
                        <div style={styles.title}>손가락 성경 앱 설치</div>
                        <div style={styles.desc}>
                            {showIOSGuide
                                ? "홈 화면에 추가하여 앱처럼 사용하세요"
                                : "오프라인에서도 성경을 읽을 수 있습니다"}
                        </div>
                    </div>
                </div>

                {showIOSGuide ? (
                    <div style={styles.iosGuide}>
                        <p style={styles.iosText}>
                            Safari 하단의{" "}
                            <span style={styles.shareIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                                    <polyline points="16 6 12 2 8 6" />
                                    <line x1="12" y1="2" x2="12" y2="15" />
                                </svg>
                            </span>{" "}
                            버튼을 누른 후<br />
                            <strong>"홈 화면에 추가"</strong>를 선택하세요
                        </p>
                    </div>
                ) : (
                    <button style={styles.installBtn} onClick={handleInstall}>
                        설치하기
                    </button>
                )}

                <button style={styles.dismissBtn} onClick={handleDismiss}>
                    나중에
                </button>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        padding: "12px",
        pointerEvents: "none",
    },
    banner: {
        pointerEvents: "auto",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 -2px 20px rgba(0,0,0,0.15)",
        padding: "16px",
        maxWidth: "420px",
        margin: "0 auto",
    },
    content: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
    },
    iconWrap: {
        flexShrink: 0,
    },
    icon: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
    },
    textWrap: {
        flex: 1,
        minWidth: 0,
    },
    title: {
        fontSize: "16px",
        fontWeight: 700,
        color: "#1a1a1a",
        marginBottom: "2px",
    },
    desc: {
        fontSize: "13px",
        color: "#666",
    },
    installBtn: {
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        background: "#ff0044",
        color: "#fff",
        fontSize: "15px",
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: "8px",
    },
    dismissBtn: {
        width: "100%",
        padding: "10px",
        border: "none",
        borderRadius: "10px",
        background: "transparent",
        color: "#999",
        fontSize: "14px",
        cursor: "pointer",
    },
    iosGuide: {
        background: "#f5f5f5",
        borderRadius: "10px",
        padding: "12px",
        marginBottom: "8px",
    },
    iosText: {
        fontSize: "13px",
        color: "#333",
        lineHeight: 1.6,
        margin: 0,
        textAlign: "center",
    },
    shareIcon: {
        display: "inline-flex",
        verticalAlign: "middle",
        color: "#007AFF",
    },
};
