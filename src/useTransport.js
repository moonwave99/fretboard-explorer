import { useState, useEffect, useRef } from "react";
import { Fretboard, FretboardSystem } from "@moonwave99/fretboard.js";
import * as Tone from "tone";
import { getId } from "./VoicingSystems/utils";
import { colors, fretboardConfig, defaultBPM } from "./config";

function isInArea(position, area) {
  if (!area) {
    return false;
  }
  return area.map(getId).includes(getId(position));
}

function isPositionPlaying(position, playingId) {
  return getId(position) === playingId;
}

function formatDegree(degree) {
  return degree === 1 ? "R" : degree;
}

let started = false;
Tone.Transport.bpm.value = defaultBPM;
const sampler = new Tone.Sampler(getSoundFontInfo()).toDestination();
const fretboardSystem = new FretboardSystem({ fretCount: 25 });

function getToneInfo(
  position,
  noteIndex,
  sequenceIndex,
  voicingId,
  fretboardSystem
) {
  const time = `${sequenceIndex}:${noteIndex}`;
  const { note, octave } = fretboardSystem.getNoteAtPosition(position);
  const noteWithOctave = `${note}${octave}`;
  const id = getId(position);
  return {
    time,
    note: noteWithOctave,
    velocity: 1,
    id,
    voicingId,
    noteIndex,
    sequenceIndex
  };
}

export default function useTransport({ settings, system }) {
  const [currentVoicingId, setCurrentVoicingId] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [isPlaying, setPlaying] = useState(false);
  const [part, setPart] = useState([]);

  const ref = useRef(null);
  const fretboard = useRef(null);

  useEffect(() => {
    if (!ref.current || fretboard.current) {
      return;
    }
    fretboard.current = new Fretboard({ el: ref.current, ...fretboardConfig });
    fretboard.current.render();
  }, []);

  useEffect(() => {
    if (!fretboard) {
      return;
    }
    const currentType = system.info.find((x) => x.type === settings.type);
    if (!currentType) {
      return;
    }
    const voicingSystem = system.generator(settings);
    const scalePositions = fretboardSystem.getScale({
      ...currentType,
      ...settings,
      type: currentType.scale
    });

    function isInVoicing(position) {
      return currentType.intervals.includes(position.interval);
    }

    if (!isPlaying) {
      fretboard.current.clear().setDots(scalePositions).render();
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }

    fretboard.current.style({
      text: (position) => (position.degree === 1 ? "R" : ""),
      fill: (position) =>
        isInVoicing(position) ? colors.voicing : colors.default,
      stroke: colors.stroke
    });

    const area = voicingSystem.getArea(currentVoicingId);
    if (area) {
      fretboard.current.clearHighlightAreas().highlightAreas(area);
    }
    fretboard.current.style({
      text: (position) =>
        isInVoicing(position) && isInArea(position, area)
          ? formatDegree(position.degree)
          : "",
      fill: (position) =>
        isInVoicing(position) && isInArea(position, area)
          ? colors.voicing
          : colors.default,
      stroke: (position) =>
        isPositionPlaying(position, playingId)
          ? colors.playingStroke
          : "transparent"
    });
    setPart(
      voicingSystem.getInfo((...x) => getToneInfo(...x, fretboardSystem))
    );
  }, [currentVoicingId, playingId, settings, system, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      return;
    }
    new Tone.Part((time, value) => {
      setCurrentVoicingId(value.voicingId);
      setPlayingId(value.id);
      sampler.triggerAttackRelease(value.note, "4n", time, value.velocity);
    }, part).start(0);
  }, [part, isPlaying]);

  async function toggle() {
    if (!started) {
      await Tone.start();
      started = true;
    }
    setPlaying((prev) => !prev);
    Tone.Transport.toggle();
  }
  function stop() {
    setPlaying(false);
    setPlayingId(-1);
    // setIndex(0);
    Tone.Transport.stop();
  }

  function selectVoicing(id) {
    setCurrentVoicingId(id);
  }

  return { ref, toggle, stop, currentVoicingId, selectVoicing, isPlaying };
}

function getSoundFontInfo() {
  const urls = "ABCDEFG".split("").reduce(
    (memo, x) => ({
      ...memo,
      ...Array.from({ length: 5 }, (_, i) => i).reduce((nemo, i) => ({
        ...nemo,
        [`${x}${i + 1}`]: `${x}${i + 1}.mp3`
      }))
    }),
    {}
  );
  return {
    baseUrl:
      "https://paulrosen.github.io/midi-js-soundfonts/MusyngKite/acoustic_guitar_steel-mp3/",
    urls
  };
}
