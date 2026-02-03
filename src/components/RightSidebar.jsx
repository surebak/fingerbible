import { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useNavigate, useParams } from 'react-router-dom';

function isInstalledPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
        navigator.standalone === true;
}

export default function RightSidebar({ isOpen, onClose }) {
    const [installed, setInstalled] = useState(isInstalledPWA);

    useEffect(() => {
        const mql = window.matchMedia('(display-mode: standalone)');
        const onChange = (e) => setInstalled(e.matches);
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, []);
    const { settings, updateSettings } = useSettings();
    const navigate = useNavigate();
    const { version, book, chapter } = useParams();

    const handleVersionChange = (e) => {
        const newVersion = e.target.value;
        // Update URL
        if (book && chapter) {
            navigate(`/${newVersion}/${book}/${chapter}`);
        } else {
            navigate(`/${newVersion}/gen/1`);
        }
    };

    const handlePWAInstall = () => {
        const promptEvent = window.deferredPrompt;
        if (promptEvent) {
            promptEvent.prompt();
            promptEvent.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                window.deferredPrompt = null;
            });
        } else if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
            alert('이미 앱으로 설치되어 있습니다.');
        } else {
            alert('브라우저 주소표시줄의 설치 아이콘을 이용해주세요.');
        }
    };

    return (
        <div className="config">
            <li id="current">
                <select value={version || 'rnksv'} onChange={handleVersionChange}>
                    <option value="krv">개역개정</option>
                    <option value="rnksv">새번역</option>
                </select>
            </li>

            <li onClick={() => updateSettings('fontSize', Math.min(72, settings.fontSize + 1))}>
                글씨 +
            </li>

            <li onClick={() => updateSettings('fontSize', Math.max(6, settings.fontSize - 1))}>
                글씨 -
            </li>

            {/* Inline toggle removed as per simplified requirements or can add if needed */}
            {/* <li id="inline">줄바꿈</li> */}

            <li onClick={() => updateSettings('theme', settings.theme === 'dark' ? 'light' : 'dark')}>
                색채
            </li>

            {!installed && (
                <li className="install-menu" onClick={handlePWAInstall}>
                    <span className="install-icon">📱</span>
                    설치하기
                </li>
            )}
        </div>
    );
}
