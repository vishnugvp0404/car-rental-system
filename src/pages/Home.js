import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CarCard from "../components/CarCard";
import "./Home.css";

const Home = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/cars");
        setCars(response.data);
      } catch (err) {
        console.error("Error fetching cars", err);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="home-container">
      <h1 className="heading">Available Cars</h1>
      <div className="car-card-container">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default Home;
