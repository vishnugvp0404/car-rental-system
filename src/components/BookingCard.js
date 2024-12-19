import React from "react";

const BookingCard = ({ booking }) => {
  return (
    <div style={styles.card}>
      <h4 style={styles.title}>Booking ID: {booking.id}</h4>
      <p style={styles.text}>Car ID: <span style={styles.highlight}>{booking.car_id}</span></p>
      <p style={styles.text}>User ID: <span style={styles.highlight}>{booking.user_id}</span></p>
      <p style={styles.text}>Dates: <span style={styles.highlight}>{booking.start_date} - {booking.end_date}</span></p>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  title: {
    textAlign:"center",
    fontSize: "1.2rem",
    color: "#333",
    marginBottom: "10px",
  },
  text: {
    fontSize: "1rem",
    color: "#555",
    margin: "5px 0",
  },
  highlight: {
    fontWeight: "bold",
    color: "#3498db",
  },
};

export default BookingCard;
