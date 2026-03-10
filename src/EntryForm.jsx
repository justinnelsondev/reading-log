import { useNavigate } from "react-router-dom";

export default function EntryForm({addEntry, book, setBook, family, pages, name, setPages, setName}) {

    const navigate = useNavigate();

    return (
        <form onSubmit={addEntry} className="d-flex flex-column gap-3">
          <select value={name} onChange={(e) => setName(e.target.value)}>
            <option value="">Select your name</option>
            {family.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <input type="number" placeholder="Pages read" value={pages} onChange={(e) => setPages(e.target.value)}></input>
          <input
            type="text"
            placeholder="Book name"
            value={book}
            onChange={(e) => setBook(e.target.value)}
            />
          <button
            type="submit"
            onClick={() => navigate("/")}
            disabled={!name || !pages}
            style={{
              backgroundColor: !name || !pages ? "#ccc" : "#008f05",
              color: !name || !pages ? "#666" : "white",
              cursor: !name || !pages ? "not-allowed" : "pointer",
            }}
          >
            Add
          </button>


        </form>
    );
}