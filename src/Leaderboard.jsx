  export default function Leaderboard({ leaderboard, totalPages, progressPercent }) {
    return (
      <div>
        <h1 style={{ marginTop: 0 }}>🏆 Leaderboard</h1>

        <div style={{
          backgroundColor: "#eee",
          borderRadius: "8px",
          height: "36px",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          marginTop: "8px"
        }}>
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
                fontSize: 16,
                fontWeight: 500,
                color: "#000",
                pointerEvents: "none",
                }}
            >
                {totalPages}/5000 Pages
            </span>
        </div>
  
        <ul style={{ listStyle: "none", padding: 0 }}>
          {leaderboard.map(([name, pages]) => {
            const percent = totalPages === 0 ? 0 : (pages / totalPages) * 100;
  
            return (
              <li key={name} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "start", marginBottom: 4 }}>
                  <strong>{name}</strong>
                </div>
  
                <div style={{ background: "#eee", height: 10, borderRadius: 6, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${percent}%`,
                      background: "linear-gradient(90deg, #4caf50, #81c784)",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
  
                <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                  {pages} pages
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  
  