"use client";

export default function UserProfile() {
  // Example static user data
  const user = {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234 567 890",
    joined: "January 2024",
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        background: "#232946",
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        padding: 32,
        color: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#2a5298", marginBottom: 24 }}>
        Profile
      </h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Name:</strong>
        <div>{user.name}</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Email:</strong>
        <div>{user.email}</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Phone:</strong>
        <div>{user.phone}</div>
      </div>
      <div>
        <strong>Joined:</strong>
        <div>{user.joined}</div>
      </div>
    </div>
  );
}