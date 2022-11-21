import { Note } from "@tonaljs/tonal";

export default function SettingsForm({ system, settings, onSubmit }) {
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
