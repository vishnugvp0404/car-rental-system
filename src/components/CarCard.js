import React from "react";
import { Link } from "react-router-dom";
import "./CarCard.css";

const CarCard = ({ car }) => {
  return (
    <div className="car-card">
      <h3>
        {car.brand} - {car.model}
      </h3>
      <p>Price per day: ${car.price_per_day}</p>
      <p>Availability: {car.is_available ? "Available" : "Available"}</p>
      <Link to={`/booking/${car.id}`}>Book Now</Link>
    </div>
  );
};

export default CarCard;
