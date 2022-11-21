import systems from "./VoicingSystems";

export default function SystemListView({ system, onSystemSelect }) {
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
