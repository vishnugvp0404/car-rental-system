import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingForm from "./pages/BookingForm";
import UserBookings from "./pages/UserBookings";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/booking/:carId" element={<BookingForm />} />
        <Route path="/user-bookings" element={<UserBookings />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
