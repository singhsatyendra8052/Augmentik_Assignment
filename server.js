const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const db = mongoose.connect(
  `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.kg9taog.mongodb.net/mydatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to assignment");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

const app = express();

let initialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(initialPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(initialPath, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(initialPath, "page-login.html"));
});

app.get("/page-register", (req, res) => {
  res.sendFile(path.join(initialPath, "page-register.html"));
});

// Define User schema and model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const Category = mongoose.model("Category", categorySchema);

app.post("/register-user", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name.length || !email.length || !password.length) {
    return res.json("Fill all the fields");
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.json({ name, email });
  } catch (err) {
    if (err.code === 11000) {
      res.json("Email already exists");
    } else {
      res.json("Error registering user");
    }
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ name: user.name, email: user.email });
    } else {
      res.json("Email or password is incorrect");
    }
  } catch (err) {
    res.json("Error logging in");
  }
});
app.post("/add-category", async (req, res) => {
  const { name, type, description } = req.body;

  if (!name || !type || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newCategory = new Category({ name, type, description });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: "Error adding category", error: err });
  }
});
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving categories", error: err });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
