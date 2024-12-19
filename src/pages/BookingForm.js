import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./BookingForm.css";

const BookingForm = () => {
  const { carId } = useParams();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    console.log(token);
    try {
      await axios.post(
        "http://localhost:3000/api/bookings",
        { user_id: userId, car_id: carId, start_date: startDate, end_date: endDate },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      navigate("/user-bookings");
    } catch (err) {
      setError("Booking failed.");
    }
  };

  return (
    <div className="booking-form-container">
      <h1 className="booking-form-heading">Booking Form</h1>
      <form onSubmit={handleSubmit} className="booking-form">
        <label htmlFor="startDate" className="form-label">Start Date</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-input"
          required
        />
        <label htmlFor="endDate" className="form-label">End Date</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-input"
          required
        />
        <button type="submit" className="submit-btn">Book Car</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default BookingForm;
