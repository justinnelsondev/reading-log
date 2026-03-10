import { register } from "./auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";


export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
    
        try {
          const userCred = await register( email, password);
          const user = userCred.user;

          await setDoc(doc(db, "users", user.uid), {
            name: name,              // from your input field
            email: user.email,
            createdAt: serverTimestamp(),
            totalPages: 0,
          });

          navigate("/");
        } catch (err) {
          setError(getFriendlyError(err.code));
        }
    
        setLoading(false);
    };
    
    const getFriendlyError = (code) => {
        switch (code) {
          case "auth/email-already-in-use":
            return "An account with this email already exists.";
      
          case "auth/invalid-email":
            return "Please enter a valid email address.";
      
          case "auth/weak-password":
            return "Password must be at least 6 characters.";
      
          default:
            return "Something went wrong. Please try again.";
        }
      };
    

    return (
        <div style={{ maxWidth: 400, margin: "100px auto", color: "white" }}>
            <h2>Create Account</h2>

            {error && (
            <div style={{ color: "red", marginBottom: 12 }}>
                {error}
            </div>
            )}

            <form
            onSubmit={handleRegister}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="mat-raised-button bg-white" style={{color: "black", borderRadius: "10px"}} type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
            </button>
            </form>

            <button
            style={{ marginTop: 20, background: "transparent", color: "white", border: "none", cursor: "pointer" }}
            onClick={() => navigate("/login")}
            >
            Already have an account? Login
            </button>
        </div>
    );
}

