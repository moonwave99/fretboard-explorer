import { Interval } from "@tonaljs/tonal";

export function generateFrom({ original, mutations = [], ...rest }) {
  const voicings = original.voicings.map((x) => {
    const positions = mutations.reduce((memo, { degree, delta }) => {
      return memo.map((p) => ({
        ...p,
        fret: p.degree === degree ? p.fret + delta : p.fret
      }));
    }, x.positions);

    const hasNegative = positions.some(({ fret }) => fret < 0);
    const bottomString = Math.max(...positions.map((x) => x.string));
    const inversion = getInversion(positions, bottomString);
    const id = `B:${bottomString}-I:${inversion}`;
    return {
      id,
      inversion,
      positions: positions.map((p) => ({
        ...p,
        fret: hasNegative ? p.fret + 12 : p.fret
      }))
    };
  });
  return {
    ...original,
    ...rest,
    voicings
  };
}

export function getId({ string, fret }) {
  return `S${string}:F${fret}`;
}

export function sortHorizontally(a, b) {
  const minFretA = Math.min(...a.positions.map((x) => x.fret));
  const minFretB = Math.min(...b.positions.map((x) => x.fret));
  const maxStringA = Math.max(...a.positions.map((x) => x.string));
  const maxStringB = Math.max(...b.positions.map((x) => x.string));
  return Math.sign(maxStringA * 100 - minFretA > maxStringB * 100 - minFretB);
}

export function getInfoFromVoicingTypes(voicingTypes) {
  return Object.entries(voicingTypes).map(([key, value]) => ({
    id: key,
    type: key,
    scale: value.scale || key,
    ...value
  }));
}

export function systemGenerator(voicingTypes) {
  return ({ root, type }) => {
    return new VoicingSystem({
      root,
      type,
      voicingTypes
    });
  };
}

function getInversion(positions, bottomString) {
  const bottomPosition = positions.find((x) => x.string === bottomString);
  return { 1: 0, 3: 1, 5: 2, 7: 3 }[bottomPosition.degree];
}

export function groupByStrings(voicings) {
  const output = {};
  voicings.forEach((x) => {
    const bottomString = Math.max(...x.positions.map((x) => x.string));
    output[bottomString] = output[bottomString]
      ? [...output[bottomString], x]
      : [x];
  });
  return output;
}

export class VoicingSystem {
  constructor({ root, type, voicingTypes }) {
    this.root = root;
    this.type = type;
    this._init(voicingTypes);
  }
  getArea(id) {
    const voicing = this._voicings.find((x) => x.id === id);
    if (!voicing) {
      return false;
    }
    return voicing.positions;
  }
  includesPositionAtIndex(position, index) {
    const voicing = this._voicing[index];
    if (!voicing) {
      return false;
    }
    const voicingIds = voicing.positions.map(getId);
    return voicingIds.includes(getId(position));
  }
  getInfo(transformer, sort = "asc") {
    return this._voicings
      .map(({ positions, id }, sequenceIndex) =>
        [...positions]
          .sort((a, b) =>
            sort === "asc"
              ? Math.sign(b.string - a.string)
              : Math.sign(a.string - b.string)
          )
          .map((position, noteIndex) =>
            transformer(position, noteIndex, sequenceIndex, id)
          )
          .flat()
      )
      .flat();
  }
  _init(voicingTypes) {
    const type = voicingTypes[this.type];
    if (!type) {
      throw new Error(`Cannot find voicing type: ${this.type}`);
    }
    const delta = Interval.semitones(Interval.distance(type.root, this.root));
    this._voicings = type.voicings
      .map(({ positions, ...rest }) => ({
        positions: positions.map((y) => ({
          ...y,
          fret: y.fret + delta
        })),
        ...rest
      }))
      .map(({ positions, ...rest }) => {
        const aboveMiddleFret = positions.every(({ fret }) => fret >= 12);
        return {
          positions: positions.map((x) => ({
            ...x,
            fret: aboveMiddleFret ? x.fret - 12 : x.fret
          })),
          ...rest
        };
      })
      .sort(sortHorizontally);
  }
}
