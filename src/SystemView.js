import { groupByStrings } from "./VoicingSystems/utils";
import Voicing from "./Voicing";

export default function SystemView({
    system,
    settings,
    currentVoicingId,
    onVoicingSelect,
}) {
    const currentType = system.info.find((x) => x.type === settings.type);
    const groupedVoicings = groupByStrings(currentType.voicings);
    return (
        <div className="system-view">
            <ul>
                {Object.entries(groupedVoicings).map(
                    ([string, voicings], index) => (
                        <li key={`i:${index}-s:${string}`}>
                            <h3>
                                Voicings based on string{" "}
                                <strong>{string}</strong>:
                            </h3>
                            <ul className="voicing-group">
                                {[
                                    ...voicings.sort((a, b) =>
                                        Math.sign(a.inversion - b.inversion)
                                    ),
                                ].map((x) => (
                                    <li key={x.id}>
                                        <Voicing
                                            current={x.id === currentVoicingId}
                                            onClick={() =>
                                                onVoicingSelect(x.id)
                                            }
                                            {...x}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )
                )}
            </ul>
        </div>
    );
}
