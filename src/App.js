import { useState } from "react";
import cx from "clsx";

import systems from "./VoicingSystems";
import PlaybackView from "./PlaybackView";
import SettingsForm from "./SettingsForm";
import SystemListView from "./SystemListView";
import SystemView from "./SystemView";

import useTransport from "./useTransport";

import "./styles.css";

export default function App() {
    const [showFretboard, setShowFretboard] = useState(true);
    const [system, setSystem] = useState(systems[0]);
    const [settings, setSettings] = useState(systems[0].info[0]);
    const { ref, toggle, stop, currentVoicingId, selectVoicing, isPlaying } =
        useTransport({
            settings,
            system,
        });

    function onSubmit(event) {
        event.preventDefault();
        const root = `${event.target.root.value}${event.target.accidental.value}`;
        setSettings({
            root,
            type: event.target.type.value,
        });
        stop();
    }

    function onSystemSelect(event) {
        const foundSystem = systems.find((x) => x.id === event.target.value);
        setSettings(foundSystem.info[0]);
        setSystem(foundSystem);
    }

    function onToggleFretboard() {
        setShowFretboard(!showFretboard);
    }

    return (
        <div className={cx("app", { "show-fretboard": showFretboard })}>
            <div className="controls">
                <h1>Fretboard Explorer</h1>
                <div className="controls-center">
                    <SystemListView
                        system={system}
                        onSystemSelect={onSystemSelect}
                    />
                    <SettingsForm
                        onSubmit={onSubmit}
                        system={system}
                        settings={settings}
                    />
                </div>
                <PlaybackView
                    onToggle={toggle}
                    onStop={stop}
                    isPlaying={isPlaying}
                    onToggleFretboard={onToggleFretboard}
                />
            </div>
            <SystemView
                system={system}
                settings={settings}
                currentVoicingId={currentVoicingId}
                onVoicingSelect={selectVoicing}
            />
            <div className="fretboard-container">
                <figure ref={ref} className="fretboard" />
            </div>
        </div>
    );
}
