import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingCard from "../components/BookingCard";
import "./UserBookings.css";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
  
      try {
        const response = await axios.get(
          `http://localhost:3000/api/bookings?user_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching bookings", err);
      }
    };
  
    fetchBookings();
  }, []);
  

  return (
    <div className="user-bookings-container">
      <h1 className="user-bookings-heading">Your Bookings</h1>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default UserBookings;
