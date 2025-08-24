"use client";

export default function BrowseCars() {
  // Example car data
  const cars = [
    {
      name: "Toyota Corolla",
      type: "Sedan",
      price: "$40/day",
      image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=400",
    },
    {
      name: "Honda CR-V",
      type: "SUV",
      price: "$55/day",
      image: "https://images.pexels.com/photos/170782/pexels-photo-170782.jpeg?auto=compress&w=400",
    },
    {
      name: "Ford Mustang",
      type: "Sports",
      price: "$90/day",
      image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=400",
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", color: "#fff" }}>
      <h2 style={{ color: "#2a5298", marginBottom: 32 }}>Browse Cars</h2>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {cars.map((car) => (
          <div
            key={car.name}
            style={{
              background: "#bfb7b7ff",
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              padding: 20,
              width: 260,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={car.image}
              alt={car.name}
              style={{
                width: "100%",
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 16,
              }}
            />
            <h4 style={{ color: "#fff", marginBottom: 8 }}>{car.name}</h4>
            <div style={{ color: "#b0b8c1", marginBottom: 8 }}>{car.type}</div>
            <div style={{ color: "#2a5298", fontWeight: 600 }}>{car.price}</div>
            <button
              style={{
                marginTop: 16,
                padding: "8px 18px",
                background: "linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );  
}