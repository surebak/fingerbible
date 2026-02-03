import { useSettings } from '../hooks/useSettings';
import { useNavigate, useParams } from 'react-router-dom';

export default function RightSidebar({ isOpen, onClose }) {
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
        // If we have a stored prompt event, triggers it. 
        // This requires global state usage or a context. 
        // For now, we'll implement the UI.
        const promptEvent = window.deferredPrompt;
        if (promptEvent) {
            promptEvent.prompt();
            promptEvent.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                window.deferredPrompt = null;
            });
        } else {
            alert('설치 가능한 상태가 아닙니다. 브라우저 설정을 확인해주세요.');
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

            <li className="install-menu" onClick={handlePWAInstall}>
                <span className="install-icon">📱</span>
                설치하기
            </li>
        </div>
    );
}
