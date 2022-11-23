import {
    systemGenerator,
    getInfoFromVoicingTypes,
    generateFrom,
} from "./utils";

const base = {
    title: "Major",
    root: "G",
    intervals: ["1P", "3M", "5P"],
    voicings: [
        // string 6 based
        {
            positions: [
                { degree: 1, string: 6, fret: 3 },
                { degree: 3, string: 5, fret: 2 },
                { degree: 5, string: 4, fret: 0 },
            ],
        },
        {
            positions: [
                { degree: 3, string: 6, fret: 7 },
                { degree: 5, string: 5, fret: 5 },
                { degree: 1, string: 4, fret: 5 },
            ],
        },
        {
            positions: [
                { degree: 5, string: 6, fret: 10 },
                { degree: 1, string: 5, fret: 10 },
                { degree: 3, string: 4, fret: 9 },
            ],
        },
        // string 5 based
        {
            positions: [
                { degree: 1, string: 5, fret: 10 },
                { degree: 3, string: 4, fret: 9 },
                { degree: 5, string: 3, fret: 7 },
            ],
        },
        {
            positions: [
                { degree: 3, string: 5, fret: 2 },
                { degree: 5, string: 4, fret: 0 },
                { degree: 1, string: 3, fret: 0 },
            ],
        },
        {
            positions: [
                { degree: 5, string: 5, fret: 5 },
                { degree: 1, string: 4, fret: 5 },
                { degree: 3, string: 3, fret: 4 },
            ],
        },
        // string 4 based
        {
            positions: [
                { degree: 1, string: 4, fret: 5 },
                { degree: 3, string: 3, fret: 4 },
                { degree: 5, string: 2, fret: 3 },
            ],
        },
        {
            positions: [
                { degree: 3, string: 4, fret: 9 },
                { degree: 5, string: 3, fret: 7 },
                { degree: 1, string: 2, fret: 8 },
            ],
        },
        {
            positions: [
                { degree: 5, string: 4, fret: 0 },
                { degree: 1, string: 3, fret: 0 },
                { degree: 3, string: 2, fret: 0 },
            ],
        },
        // string 3 based
        {
            positions: [
                { degree: 1, string: 3, fret: 12 },
                { degree: 3, string: 2, fret: 12 },
                { degree: 5, string: 1, fret: 10 },
            ],
        },
        {
            positions: [
                { degree: 3, string: 3, fret: 4 },
                { degree: 5, string: 2, fret: 3 },
                { degree: 1, string: 1, fret: 3 },
            ],
        },
        {
            positions: [
                { degree: 5, string: 3, fret: 7 },
                { degree: 1, string: 2, fret: 8 },
                { degree: 3, string: 1, fret: 7 },
            ],
        },
    ],
};

const major = generateFrom({
    original: base,
    ...base,
});

const augmented = generateFrom({
    original: major,
    title: "Augmented",
    intervals: ["1P", "3M", "5A"],
    mutations: [{ degree: 5, delta: 1 }],
});

const minor = generateFrom({
    original: major,
    title: "Minor",
    intervals: ["1P", "3m", "5P"],
    mutations: [{ degree: 3, delta: -1 }],
});

const diminished = generateFrom({
    original: minor,
    title: "Diminished",
    scale: "locrian",
    intervals: ["1P", "3m", "5D"],
    mutations: [{ degree: 5, delta: -1 }],
});

const types = { major, minor, diminished, augmented };

export const generator = systemGenerator(types);
export const info = getInfoFromVoicingTypes(types);
