import { useState } from "react";
import cx from "clsx";
import { Note } from "@tonaljs/tonal";
import systems from "./VoicingSystems";
import { groupByStrings } from "./VoicingSystems/utils";
import useTransport from "./useTransport";
import useChord from "./useChord";

import "./styles.css";

export default function App() {
  const [showFretboard, setShowFretboard] = useState(true);
  const [system, setSystem] = useState(systems[0]);
  const [settings, setSettings] = useState(systems[0].info[0]);
  const {
    ref,
    toggle,
    stop,
    currentVoicingId,
    selectVoicing,
    isPlaying
  } = useTransport({
    settings,
    system
  });

  function onSubmit(event) {
    event.preventDefault();
    const root = `${event.target.root.value}${event.target.accidental.value}`;
    setSettings({
      root,
      type: event.target.type.value
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
          <SystemListView system={system} onSystemSelect={onSystemSelect} />
          <SettingsForm
            onSubmit={onSubmit}
            system={system}
            settings={settings}
          />
        </div>
        <PlayBackView
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
      <footer>
        2022 - An experiment by{" "}
        <a href="https://www.diegocaponera.com">mwlabs</a>. Made with{" "}
        <a href="https://moonwave99.github.io/fretboard.js/">fretboard.js</a>.
      </footer>
    </div>
  );
}

function SettingsForm({ system, settings, onSubmit }) {
  const { acc, letter } = Note.get(settings.root);
  return (
    <form onSubmit={onSubmit}>
      <label>
        Root
        <select name="root" defaultValue={letter}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="G">G</option>
        </select>
      </label>
      <label>
        Accidental
        <select name="accidental" defaultValue={acc}>
          <option value="">♮</option>
          <option value="#">♯</option>
          <option value="b">♭</option>
        </select>
      </label>
      <label>
        Type
        <select name="type">
          {system.info.map((x) => (
            <option key={x.id} value={x.id}>
              {x.title}
            </option>
          ))}
        </select>
      </label>
      <button>Show</button>
    </form>
  );
}

function PlayBackView({ onToggle, onStop, isPlaying, onToggleFretboard }) {
  return (
    <div className="playback-tray">
      <button onClick={onToggleFretboard}>Toggle Fretboard</button>
      <button onClick={isPlaying ? onStop : onToggle}>
        {isPlaying ? "■" : "▶"}
      </button>
    </div>
  );
}

function SystemListView({ system, onSystemSelect }) {
  return (
    <label className="system-list">
      Type
      <select onChange={onSystemSelect} value={system.id}>
        {systems.map((x) => (
          <option key={x.id} value={x.id}>
            {x.title}
          </option>
        ))}
      </select>
    </label>
  );
}

function SystemView({ system, settings, currentVoicingId, onVoicingSelect }) {
  const currentType = system.info.find((x) => x.type === settings.type);
  const groupedVoicings = groupByStrings(currentType.voicings);
  return (
    <div className="system-view">
      <ul>
        {Object.entries(groupedVoicings).map(([string, voicings], index) => (
          <li key={`i:${index}-s:${string}`}>
            <h3>
              Voicings based on string <strong>{string}</strong>:
            </h3>
            <ul className="voicing-group">
              {[
                ...voicings.sort((a, b) => Math.sign(a.inversion - b.inversion))
              ].map((x) => (
                <li key={x.id}>
                  <Voicing
                    current={x.id === currentVoicingId}
                    onClick={() => onVoicingSelect(x.id)}
                    {...x}
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

const inversionLabels = {
  0: "Root",
  1: "1st inversion",
  2: "2nd inversion",
  3: "3rd inversion"
};

function Voicing({ current, onClick, inversion, positions }) {
  const ref = useChord(positions);
  return (
    <article className={cx("voicing", { current })} onClick={onClick}>
      <figure ref={ref} />
      <span className="inversion">{inversionLabels[inversion]}</span>
    </article>
  );
}
