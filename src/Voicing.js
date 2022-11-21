import cx from "clsx";
import useChord from "./useChord";
import { inversionLabels } from "./config";

export default function Voicing({ current, onClick, inversion, positions }) {
    const ref = useChord(positions);
    return (
        <article className={cx("voicing", { current })} onClick={onClick}>
            <figure ref={ref} />
            <span className="inversion">{inversionLabels[inversion]}</span>
        </article>
    );
}
