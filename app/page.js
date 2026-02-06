"use client";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("flood"); // 'flood' or 'drain'

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setStatus("loading");
    setResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = reader.result.split(",")[1];
        
        // SELECT API BASED ON MODE
        const apiEndpoint = mode === "flood" 
          ? "/api/verify-image" 
          : "/api/verify-drain";

        console.log(`Sending to ${mode} detector...`);

        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await response.json();
        setResult(data);
        setStatus("success");
      };
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif", textAlign: "center" }}>
      
      {/* HEADER & TOGGLE */}
      <h1 style={{ marginBottom: "20px" }}>🛡️ Civic Eye AI</h1>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
        <button 
          onClick={() => setMode("flood")}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: mode === "flood" ? "#ef4444" : "#e5e7eb",
            color: mode === "flood" ? "white" : "black",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          🌊 Detect Flood
        </button>
        <button 
          onClick={() => setMode("drain")}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: mode === "drain" ? "#d97706" : "#e5e7eb",
            color: mode === "drain" ? "white" : "black",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          🗑️ Detect Clogged Drain
        </button>
      </div>

      {/* UPLOAD SECTION */}
      <div style={{ border: "2px dashed #ccc", padding: "40px", borderRadius: "10px" }}>
        <p style={{ marginBottom: "10px", color: "#666" }}>
          Upload photo of {mode === "flood" ? "flood water" : "a blocked drain"}
        </p>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {/* STATUS */}
      {status === "loading" && <p style={{ marginTop: "20px", fontWeight: "bold" }}>🤖 AI is analyzing for {mode}...</p>}

      {/* RESULT */}
      {image && (
        <div style={{ marginTop: "30px" }}>
          <img src={image} style={{ width: "100%", borderRadius: "10px", marginBottom: "20px" }} />
          
          {result && (
            <div style={{ 
              padding: "20px", 
              borderRadius: "10px",
              background: result.verified ? (mode === "flood" ? "#fee2e2" : "#kfefce") : "#f3f4f6",
              border: `2px solid ${result.verified ? (mode === "flood" ? "red" : "orange") : "gray"}`
            }}>
              <h2 style={{ color: result.verified ? "black" : "gray", margin: 0 }}>
                {result.verified ? "🚨 VERIFIED ISSUE" : "✅ No Issue Detected"}
              </h2>
              <p style={{ fontSize: "18px", marginTop: "10px" }}>{result.reason}</p>
              {result.severity && <span style={{ background: "black", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>Severity: {result.severity}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}