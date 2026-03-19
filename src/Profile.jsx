import { useMemo, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

function Profile({ user, entries }) {

  const [name, setName] = useState("");

  // 📥 Load user's name from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setName(docSnap.data().name);
      }
    };

    fetchUser();
  }, [user]);

  // 🧮 Total pages
  const totalPages = useMemo(() => {
    return entries
      .filter((entry) => entry.userId === user?.uid)
      .reduce((sum, entry) => sum + entry.pages, 0);
  }, [entries, user]);

  // 📚 Unique books
  const books = useMemo(() => {
    return [
      ...new Set(
        entries
          .filter((entry) => entry.userId === user?.uid)
          .map((entry) => entry.book)
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [entries, user]);

  // 🏆 Leaderboard (by name)
  const leaderboard = useMemo(() => {
    const totals = {};

    entries.forEach((entry) => {
      if (!totals[entry.name]) {
        totals[entry.name] = 0;
      }
      totals[entry.name] += entry.pages;
    });

    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  // 🏅 Rank
  const rank = useMemo(() => {
    const index = leaderboard.findIndex(([n]) => n === name);
    return index === -1 ? "-" : index + 1;
  }, [leaderboard, name]);

  // 🎯 Personal goal (localStorage)
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem("personalGoal");
    return saved ? Number(saved) : 1000;
  });

  useEffect(() => {
    localStorage.setItem("personalGoal", goal);
  }, [goal]);

  const progressPercent =
    goal === 0 ? 0 : Math.min((totalPages / goal) * 100, 100);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Profile</h1>

      <div
        style={{
          backgroundColor: "#1e1e1e",
          padding: 20,
          borderRadius: 12,
          color: "white",
          marginTop: 20,
        }}
      >
        {/* 👤 Name */}
        <h2>{name || user.email}</h2>

        {/* 🏆 Rank */}
        <p>🏆 Rank: <strong>#{rank}</strong></p>

        {/* 📚 Total Pages */}
        <p style={{ fontSize: 22 }}>📚 Total Pages Read</p>
        <p style={{ fontSize: 32, fontWeight: "bold" }}>
          {totalPages}
        </p>

        {/* 🎯 Goal input */}
        <div style={{ marginTop: 20 }}>
          <label>Set Personal Goal:</label>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            style={{ marginLeft: 10 }}
          />
        </div>

        {/* 📊 Progress Bar */}
        <div
          style={{
            backgroundColor: "#eee",
            borderRadius: "8px",
            height: "20px",
            marginTop: "10px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              backgroundColor: "#4caf50",
              width: `${progressPercent}%`,
              height: "100%",
              transition: "width 0.3s",
            }}
          />

          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 500,
              color: "#000",
            }}
          >
            {totalPages}/{goal}
          </span>
        </div>
      </div>

      {/* 📚 Books list */}
      <div style={{ marginTop: 30 }}>
        <h2>Books You've Logged</h2>

        {books.length === 0 ? (
          <p>No books yet</p>
        ) : (
          <ul>
            {books.map((book, i) => (
              <li key={i}>{book}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
