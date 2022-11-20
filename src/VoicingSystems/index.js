import * as Triads from "./triads";
import * as Drop2 from "./drop2";

const systems = [
  {
    id: "triads",
    title: "Triads",
    ...Triads
  },
  {
    id: "drop2",
    title: "Drop 2 voicings",
    ...Drop2
  }
];

export default systems;
