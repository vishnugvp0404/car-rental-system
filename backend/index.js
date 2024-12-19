const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 3000;
const SECRET_KEY = "your_secret_key"; // Replace with a strong secret key

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "group5", // Replace with your MySQL password
  database: "car_rental",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Middleware for verifying JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).json({ error: "Unauthorized access." });

  jwt.verify(token,SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden." });
    req.user = user; // Attach user info to the request
    console.log("authenticated");
    next();
  });
};


// **1. User Authentication**
// Register User
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query("SELECT email FROM users WHERE email = ?", [email], (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ error: "Email already exists." });
    }

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User registered successfully." });
      }
    );
  });
});

// Login User
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid email or password." });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

// **2. Cars Management**
// Get All Cars
app.get("/api/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
 
// Add a New Car (Admin Only)
app.post("/api/cars", authenticateToken, (req, res) => {
  const { model, brand, price_per_day, availability } = req.body;

  db.query(
    "INSERT INTO cars (model, brand, price_per_day, availability) VALUES (?, ?, ?, ?)",
    [model, brand, price_per_day, availability],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Car added successfully." });
    }
  );
});

// Update Car Details (Admin Only)
app.put("/api/cars/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { price_per_day, availability } = req.body;

  db.query(
    "UPDATE cars SET price_per_day = ?, availability = ? WHERE id = ?",
    [price_per_day, availability, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Car updated successfully." });
    }
  );
});

// Delete Car (Admin Only)
app.delete("/api/cars/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM cars WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Car deleted successfully." });
  });
});

app.get("/api/admin/bookings", authenticateToken, async (req, res) => {
  console.log("Into line 177");

  try {
    // Get all bookings
    const [bookings] = await db.promise().query("SELECT * FROM bookings");
    
    // For each booking, fetch the corresponding user name
    for (let i = 0; i < bookings.length; i++) {
      const [user] = await db.promise().query("SELECT name FROM users WHERE id = ?", [bookings[i].user_id]);
      bookings[i].user_name = user[0].name;  // Add the user's name to the booking object
    }
    
    // Send the updated bookings with user names
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



// Get Bookings for a Specific User
app.get("/api/bookings", authenticateToken, (req, res) => {
  const userId = req.query.user_id;
  console.log("Into line 142");
  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }
  console.log("Into line 146");
  // Ensure only the authenticated user's bookings are returned

  // if (req.user.id != userId) {
  //   return res.status(403).json({ error: "Unauthorized to access this user's bookings." });
  // }
  console.log("Into line 151");
  const query = `
    SELECT bookings.*, cars.model, cars.brand 
    FROM bookings 
    JOIN cars ON bookings.car_id = cars.id 
    WHERE bookings.user_id = ?
    ORDER BY bookings.start_date DESC
  `;

  db.query(query, [req.user.id], (err, results) => {
    if (err) {
      console.error("Error fetching bookings:", err);
      return res.status(500).json({ error: "Failed to fetch bookings." });
    }
    console.log("Into line 165");
    res.json(results);
  });
});



// **3. Booking Management**
// Book a Car






app.post("/api/bookings", authenticateToken, (req, res) => {
  console.log("Booking request body:", req.body);
  const {  car_id, start_date, end_date } = req.body;
  const user_id = req.user.id;
  console.log("In backend line 141 : "+user_id, car_id, start_date, end_date);
  db.query(
    "INSERT INTO bookings (user_id, car_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)",
    [user_id, car_id, start_date, end_date, "confirmed"],
    (err, results) => {
      if (err) {
        console.error("Error during booking:", err);
        return res.status(500).json({ error: "Failed to book car." });
      }
      res.json({ message: "Car booked successfully.", booking_id: results.insertId });
    }
  );
});



// Get All Bookings (Admin Only)


// Cancel a Booking
app.delete("/api/bookings/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM bookings WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Booking canceled successfully." });
  });
});

// **4. Admin Dashboard**
app.get("/api/admin/dashboard", authenticateToken, (req, res) => {
  db.query(
    "SELECT (SELECT COUNT(*) FROM users) AS total_users, (SELECT COUNT(*) FROM cars) AS total_cars, (SELECT COUNT(*) FROM bookings) AS total_bookings, (SELECT COUNT(*) FROM cars WHERE availability = 1) AS available_cars",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0]);
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
