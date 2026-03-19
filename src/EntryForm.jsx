import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function EntryForm({ addEntry, book, setBook, pages, setPages, entries, user }) {

  const navigate = useNavigate();

  // 📚 Get previous books for this user
  const previousBooks = useMemo(() => {
    return [
      ...new Set(
        entries
          .filter((e) => e.userId === user?.uid)
          .map((e) => e.book)
          .filter(Boolean)
      ),
    ];
  }, [entries, user]);

  return (
    <form
      onSubmit={(e) => {
        addEntry(e);
        navigate("/");
      }}
      className="d-flex flex-column gap-3"
    >

      {/* 📖 Pages */}
      <input
        type="number"
        placeholder="Pages read"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
      />

      {/* 📚 Book input with suggestions */}
      <input
        type="text"
        placeholder="Book name"
        value={book}
        onChange={(e) => setBook(e.target.value)}
        list="books"
      />

      {/* 🔽 Suggestions dropdown */}
      <datalist id="books">
        {previousBooks.map((b, i) => (
          <option key={i} value={b} />
        ))}
      </datalist>

      {/* ✅ Submit */}
      <button
        type="submit"
        disabled={!pages || !book}
        style={{
          backgroundColor: !pages || !book ? "#ccc" : "#008f05",
          color: !pages || !book ? "#666" : "white",
          cursor: !pages || !book ? "not-allowed" : "pointer",
        }}
      >
        Add
      </button>

    </form>
  );
}
