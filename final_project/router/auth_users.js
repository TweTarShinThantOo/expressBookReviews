const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// check if username is valid (not empty)
const isValid = (username) => {
  return typeof username === "string" && username.trim().length > 0;
}

// check if username and password match
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// REGISTER
regd_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!isValid(username) || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User successfully registered" });
});

// LOGIN
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!isValid(username) || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid Login" });
  }

  const accessToken = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });

  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({ message: "User successfully logged in" });
});

// ADD / MODIFY REVIEW
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!review) {
      return res.status(400).json({ message: "Review cannot be empty" });
    }

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });

  } catch (err) {
    return res.status(500).json({ message: "Error", error: err.message });
  }
});

// DELETE REVIEW
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this user" });
    }

    delete books[isbn].reviews[username];

    return res.json({ message: "Review deleted successfully" });

  } catch (err) {
    return res.status(500).json({ message: "Error", error: err.message });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;