const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

/* File Upload */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* ADMIN LOGIN */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM admin WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (result.length > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  );
});

/* ADD SERVICE */
app.post("/add-service", (req, res) => {
  const { name, icon } = req.body;

  db.query(
    "INSERT INTO services (name, icon) VALUES (?, ?)",
    [name, icon],
    () => {
      res.send("Service Added");
    }
  );
});

/* GET SERVICES */
app.get("/services", (req, res) => {
  db.query("SELECT * FROM services", (err, result) => {
    res.json(result);
  });
});

/* CONTACT FORM */
app.post("/contact", upload.single("file"), (req, res) => {
  const { name, phone, message } = req.body;
  const file = req.file ? req.file.filename : null;

  db.query(
    "INSERT INTO contacts (name, phone, message, file) VALUES (?, ?, ?, ?)",
    [name, phone, message, file],
    () => {
      res.send("Submitted Successfully");
    }
  );
});

/* GET CONTACTS (ADMIN) */
app.get("/contacts", (req, res) => {
  db.query("SELECT * FROM contacts", (err, result) => {
    res.json(result);
  });
});

/*FOR DEPLOYEMENT code UPDATED BELOW */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running...");
});  

/*ADD ADMIN PANEL DASHBOARD */
/* GET ALL CONTACTS */
app.get("/contacts", (req, res) => {
  db.query("SELECT * FROM contacts ORDER BY id DESC", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

/* DELETE CONTACT */
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM contacts WHERE id=?", [id], (err) => {
    if (err) throw err;
    res.send("Deleted Successfully");
  });
});


/* LOGIN and SECURITY */
/* ADMIN LOGIN */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM admin WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (result.length > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  );
});

/* DASHBOARD STATS */
app.get("/stats", (req, res) => {
  db.query("SELECT COUNT(*) as total FROM contacts", (err, result) => {
    res.json(result[0]);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});