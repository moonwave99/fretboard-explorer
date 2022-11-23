import {
    systemGenerator,
    getInfoFromVoicingTypes,
    generateFrom,
} from "./utils";

const base = {
    root: "G",
    title: "Major 7th",
    scale: "major",
    intervals: ["1P", "3M", "5P", "7M"],
    voicings: [
        {
            positions: [
                { degree: 1, string: 6, fret: 3 },
                { degree: 3, string: 5, fret: 2 },
                { degree: 5, string: 5, fret: 5 },
                { degree: 7, string: 4, fret: 4 },
                { degree: 1, string: 4, fret: 5 },
                { degree: 3, string: 3, fret: 4 },
                { degree: 5, string: 2, fret: 3 },
                { degree: 7, string: 1, fret: 2 },
                { degree: 1, string: 1, fret: 3 },
            ],
        },
    ],
};

const majorSeventh = generateFrom({
    original: base,
    ...base,
});

const dominantSeventh = generateFrom({
    original: majorSeventh,
    title: "Dominant 7th",
    scale: "mixolydian",
    intervals: ["1P", "3M", "5P", "7m"],
    mutations: [{ degree: 7, delta: -1 }],
});

const minorMajorSeventh = generateFrom({
    original: majorSeventh,
    title: "Minor Maj 7th",
    scale: "harmonic minor",
    intervals: ["1P", "3m", "5P", "7M"],
    mutations: [{ degree: 3, delta: -1 }],
});

const minorSeventh = generateFrom({
    original: majorSeventh,
    title: "Minor 7th",
    scale: "minor",
    intervals: ["1P", "3m", "5P", "7m"],
    mutations: [
        { degree: 3, delta: -1 },
        { degree: 7, delta: -1 },
    ],
});

const halfDiminished = generateFrom({
    original: minorSeventh,
    title: "Half Diminished",
    scale: "locrian",
    intervals: ["1P", "3m", "5D", "7m"],
    mutations: [{ degree: 5, delta: -1 }],
});

const fullDiminished = generateFrom({
    original: halfDiminished,
    title: "Full Diminished",
    scale: "diminished",
    intervals: ["1P", "3m", "5D", "7D"],
    mutations: [{ degree: 7, delta: -1 }],
});

const types = {
    majorSeventh,
    dominantSeventh,
    minorMajorSeventh,
    minorSeventh,
    halfDiminished,
    fullDiminished,
};

export const generator = systemGenerator(types);
export const info = getInfoFromVoicingTypes(types);
