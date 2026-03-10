import { useState } from "react";
import { login } from "./auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      await login(email, password);
      navigate("/"); 
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {error && (
            <div style={{
                color: "red",
                marginBottom: "12px"
            }}>
                {error}
            </div>
        )}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="mat-raised-button bg-white" style={{color: "black", borderRadius: "10px"}} type="submit">Login</button>
      </form>
      <button onClick={() => navigate("/register")} className="mat-raised-button mt-3 py-0 border create-account-btn">+ Create New Account</button>
    </div>
  );
}