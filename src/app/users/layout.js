"use client"; // Only because we might add hooks later, safe to keep for now

export default function UsersLayout({ children }) {
  return (
    <div style={{ padding: "2rem", minHeight: "100vh" }}>
      <h1 style={{ color: "#fff", marginBottom: "1.5rem" }}>Users Section</h1>
      {children}
    </div>
  );
}
