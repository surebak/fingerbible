import { useMultiWindow } from '../contexts/MultiWindowContext';
import { ALL_BOOKS } from '../constants/bibleData';

const VERSION_LABELS = { krv: '개역개정', rnksv: '새번역' };
const VERSION_COLORS = { krv: '#00beff', rnksv: '#ff0044' };

export default function TileManager({ isOpen, onClose, onSelectWindow, onAddWindow }) {
    const { windows, activeWindowId, addWindow, removeWindow, setActiveWindow } = useMultiWindow();

    if (!isOpen) return null;

    const handleTileClick = (win) => {
        setActiveWindow(win.id);
        onSelectWindow(win);
        onClose();
    };

    const handleAdd = () => {
        const newWin = addWindow();
        onAddWindow(newWin);
    };

    const handleDelete = (e, windowId) => {
        e.stopPropagation();
        if (windows.length <= 1) return;
        removeWindow(windowId);
    };

    return (
        <div className="tile-overlay" onClick={onClose}>
            <div className="tile-container" onClick={e => e.stopPropagation()}>
                <div className="tile-header">
                    <button className="tile-close-btn" onClick={onClose}>✕</button>
                </div>
                <div className="tile-grid">
                    {windows.map(win => {
                        const bookName = ALL_BOOKS.find(b => b.id === win.book)?.name || win.book;
                        const isActive = win.id === activeWindowId;
                        return (
                            <div
                                key={win.id}
                                className={`tile-card ${isActive ? 'tile-active' : ''}`}
                                onClick={() => handleTileClick(win)}
                            >
                                {windows.length > 1 && (
                                    <button
                                        className="tile-delete-btn"
                                        onClick={(e) => handleDelete(e, win.id)}
                                    >
                                        ✕
                                    </button>
                                )}
                                <div className="tile-book">{bookName} {win.chapter}장</div>
                                <div className="tile-version" style={{ color: VERSION_COLORS[win.version] || '#999' }}>
                                    {VERSION_LABELS[win.version] || win.version}
                                </div>
                            </div>
                        );
                    })}
                    <div className="tile-card tile-add" onClick={handleAdd}>
                        <div className="tile-add-icon">+</div>
                        <div className="tile-add-label">새 창</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
