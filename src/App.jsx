import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import { useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import Leaderboard from "./Leaderboard";

function App() {
  const family = ["Justin", "Abir", "Elena", "Iyan", "Ryan", "Simran", "Joey", "Aka", "Fariha", "Adina", "Michelle", "Bishakh"];

  const GOAL = 5000;

  const [name, setName] = useState(family[0]);
  const [pages, setPages] = useState("");
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("readingEntries");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const q = query(collection(db, "entries"), orderBy("createdAt", "desc"));
    const unscubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setEntries(data);
    })
    return () => unscubscribe();
  }, []);

  const addEntry = async (e) => {
    e.preventDefault();
    if (!pages) return;

    await addDoc(collection(db, "entries"), {
      name,
      pages: Number(pages),
      createdAt: serverTimestamp(),
    });

    setPages("");
  }

  const totals = Object.fromEntries(family.map((name) => [name, 0]));

  entries.forEach((entry) => {
    totals[entry.name] += entry.pages;
  });


  const groupTotal = entries.reduce((sum, entry) => sum + entry.pages, 0);

  const progressPercent = Math.min((groupTotal / GOAL) * 100, 100);

  const leaderboard = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ maxWidth: 500, fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Link to="/">Log Pages</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
    <>
      <div style={{ padding:24 }}>
        <h1>Inner Reading Challenge</h1>

        <h2>Goal:  {GOAL}  </h2>

        <div style={{
          backgroundColor: "#eee",
          borderRadius: "8px",
          height: "24px",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          marginTop: "8px"
        }}>
          {/* Inner bar */}
          <div style={{
            backgroundColor: "#4caf50",
            width: `${progressPercent}%`,
            height: "100%",
            transition: "width 0.3s ease"
          }}>
          </div>
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
                pointerEvents: "none",
                }}
            >
                {groupTotal}/5000 Pages
            </span>
        </div>
  

        <form onSubmit={addEntry}>
          <select value={name} onChange={(e) => setName(e.target.value)}>
            <option value="">Select your name</option>
            {family.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <input type="number" placeholder="Pages read" value={pages} onChange={(e) => setPages(e.target.value)}></input>
          <button
            type="submit"
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

        <h2>Entries</h2>
        <ul>
          {entries.map((e, i) => (
            <li key={i}>
              {e.name}: {e.pages} pages
            </li>
          ))}
        </ul>

        <h2>Leaderboard</h2>
        <ol>
          {leaderboard.map(([name, total], i) => (
            <li key={i}>
              {name}: {total} pages
            </li>
          ))}
        </ol>
      </div>
    </>
          }
          />
          <Route path="/leaderboard" element={<Leaderboard leaderboard={leaderboard} progressPercent={progressPercent} totalPages={groupTotal} />} />
      </Routes>
    </div>
  )
}

export default App
