const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const port = 3306;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "alagang_bayan"
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to MySQL");
});

// Register route
app.post("/register", (req, res) => {
  const { username, password, fullname } = req.body;

  const query = "INSERT INTO users (username, password, fullname) VALUES (?, ?, ?)";
  db.query(query, [username, password], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.send("Username already exists.");
      }
      return res.send("Registration failed.");
    }
    res.send("Registered successfully.");
  });
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.send("Login successful!");
    } else {
      res.send("Invalid username or password.");
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
