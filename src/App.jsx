import { useState } from 'react'
import './App.css'
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import Login from "./Login";
import { useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase";
import Leaderboard from "./Leaderboard";
import EntryForm from './EntryForm';
import Register from './Register';

function App() {
  const family = ["Justin", "Abir", "Elena", "Iyan", "Ryan", "Simran", "Joey", "Aka", "Fariha", "Adina", "Michelle", "Bishakh"];

  const GOAL = 5000;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(family[0]);
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState("");
  const [book, setBook] = useState("");
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("readingEntries");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    console.log("Auth listener starting...");
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

      console.log("Auth resolved:", currentUser);
      setUser(currentUser);
      setLoading(false);
    });
  
    return unsubscribe;
  }, []);
  

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "entries"), orderBy("createdAt", "desc"));
    const unscubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setEntries(data);
    })
    return () => unscubscribe();
  }, [user]);

  


  const addEntry = async (e) => {
    e.preventDefault();
    if (!pages) return;

    await addDoc(collection(db, "entries"), {
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      book,
      pages: Number(pages),
      kudos: 0,
      createdAt: serverTimestamp(),
    });

    setBook("");
    setPages("");
  }

  const giveKudos = async (id) => {
    const entryRef = doc(db, "entries", id);
  
    await updateDoc(entryRef, {
      kudos: increment(1),
    });
  };

  const totals = Object.fromEntries(family.map((name) => [name, 0]));

  entries.forEach((entry) => {
    totals[entry.name] += entry.pages;
  });


  const groupTotal = entries.reduce((sum, entry) => sum + entry.pages, 0);

  const progressPercent = Math.min((groupTotal / GOAL) * 100, 100);

  const leaderboard = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 500, fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Link to="/">Log Pages</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={ user ? <>
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
  
          <button
            type="button"
            onClick={() => navigate("/entryForm")}
            className="my-4"
            style={{
              backgroundColor: "#008f05",
              color: "white",
            }}
          >
            Add
          </button>

        <h2>Entries</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {entries.map((e, i) => (
            <div
              key={i}
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "#1e1e1e",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                color: "white",
              }}
            >
              <div className='row'>
                <div className='col d-flex justify-content-between'>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>{e.name}</h3>
                  <small style={{ color: "#aaa" }}>
                    {e.createdAt?.toDate().toLocaleString()}
                  </small>
                </div>
              </div>
              
              <p style={{ margin: "8px 0", fontSize: '24px' }}>
                📖 {e.book}
              </p>
              <p style={{ margin: "4px 0", fontSize: '18px' }}>
                {e.pages} pages
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                <button
                  onClick={() => giveKudos(e.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4da6ff",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  👍 {e.kudos || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </> : <Navigate to="/login" />
          }
          />
          <Route path="/leaderboard" element={<Leaderboard leaderboard={leaderboard} progressPercent={progressPercent} totalPages={groupTotal} />} />
          <Route path="/entryForm" element={<EntryForm book={book} setBook={setBook} addEntry={addEntry} family={family} pages={pages} name={name} setName={setName} setPages={setPages}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
