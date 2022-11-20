import { useEffect, useRef } from "react";
import { Fretboard } from "@moonwave99/fretboard.js";
import { chordConfig } from "./config";

function getFretCount(positions) {
  const frets = positions.map((x) => x.fret);
  const from = Math.min(...frets);
  const to = Math.max(...frets);
  return to - from + 1 + 2;
}

export default function useChord(positions) {
  const ref = useRef(null);
  const fretboard = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (fretboard.current) {
      ref.current.querySelector(".fretboard-html-wrapper").remove();
    }
    fretboard.current = new Fretboard({
      ...chordConfig,
      el: ref.current,
      fretCount: getFretCount(positions)
    })
      .setDots(positions)
      .render()
      .style({
        text: (x) => (x.degree === 1 ? "" : x.degree),
        fill: (x) => (x.degree === 1 ? "red" : "white")
      });
  }, [positions]);
  return ref;
}
