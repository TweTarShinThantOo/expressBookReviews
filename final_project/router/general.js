const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// =======================
// Register (placeholder)
// =======================
public_users.post("/register", (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

// =======================
// Task 1 - Get all books
// =======================
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// =======================
// Task 2 - ISBN
// =======================
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

// =======================
// Task 3 - Author
// =======================
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let result = {};

  for (let key in books) {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  }

  return res.status(200).json(result);
});

// =======================
// Task 4 - Title
// =======================
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let result = {};

  for (let key in books) {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  }

  return res.status(200).json(result);
});

// =======================
// Task 5 - Reviews
// =======================
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

// ===================================================
// TASK 10 - REQUIRED AXIOS IMPLEMENTATION
// ===================================================

// Async/Await - ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/isbn/' + req.params.isbn);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Async/Await - Title
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/title/' + req.params.title);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Promise - Author
public_users.get('/promise/author/:author', (req, res) => {
  axios.get('http://localhost:5000/author/' + req.params.author)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });
});

module.exports.general = public_users;