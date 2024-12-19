import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/Modal";

const AdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCar, setNewCar] = useState({ brand: "", model: "", price_per_day: "", is_available: true });

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/cars");
      setCars(response.data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleAddCar = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post('http://localhost:3000/api/cars', newCar, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowModal(false);
      fetchCars();
    } catch (err) {
      console.error("Error adding car:", err);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchBookings();
  }, []);

  return (
    <div style={styles.dashboardContainer}>
      <h1 style={styles.header}>Admin Dashboard</h1>
      <button style={styles.addButton} onClick={() => setShowModal(true)}>Add New Car</button>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Car Inventory</h2>
        <div style={styles.carGrid}>
          {cars.map((car) => (
            <div key={car.id} style={styles.carItem}>
              <p style={styles.carText}>{car.brand} - {car.model} <span style={styles.price}>(${car.price_per_day}/day)</span></p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>All Bookings</h2>
        <div style={styles.bookingList}>
          {bookings.map((booking) => (
            <div key={booking.id} style={styles.bookingItem}>
              <p style={styles.bookingText}>User: {booking.user_name}</p>
              <p style={styles.bookingText}>Car: {booking.car_id}</p>
              <p style={styles.bookingText}>Dates: {booking.start_date} - {booking.end_date}</p>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3 style={styles.modalHeader}>Add New Car</h3>
          <input
            type="text"
            placeholder="Brand"
            value={newCar.brand}
            onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Model"
            value={newCar.model}
            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Price Per Day"
            value={newCar.price_per_day}
            onChange={(e) => setNewCar({ ...newCar, price_per_day: e.target.value })}
            style={styles.input}
          />
          <button onClick={handleAddCar} style={styles.submitButton}>Add Car</button>
        </Modal>
      )}
    </div>
  );
};

const styles = {
  dashboardContainer: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f4f6f9",
  },
  header: {
    textAlign: "center",
    fontSize: "2rem",
    color: "#333",
    marginBottom: "20px",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "30px",
  },
  subHeader: {
    fontSize: "1.5rem",
    marginBottom: "15px",
    color: "#555",
  },
  carGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  carItem: {
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },
  carText: {
    fontSize: "1rem",
    color: "#333",
  },
  price: {
    fontWeight: "bold",
    color: "#e67e22",
  },
  bookingList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  bookingItem: {
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },
  bookingText: {
    fontSize: "1rem",
    color: "#333",
  },
  modalHeader: {
    fontSize: "1.5rem",
    marginBottom: "15px",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default AdminDashboard;
