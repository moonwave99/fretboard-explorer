export default function PlaybackView({
    onToggle,
    onStop,
    isPlaying,
    onToggleFretboard,
}) {
    return (
        <div className="playback-tray">
            <button onClick={onToggleFretboard}>Toggle Fretboard</button>
            <button onClick={isPlaying ? onStop : onToggle}>
                {isPlaying ? "■" : "▶"}
            </button>
        </div>
    );
}
