const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(user => user.username === username);
  return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  //check if username and password are not empty
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  //check if username already exists
  const user = users.find(user => user.username === username);
  //write code to check if username and password match the one we have in records.
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, 'mysecretkey123jwt', { expiresIn: '1h' });

  req.session.token = token;

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.body;

  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: "User not logged in" });
  }

  try {
    const decoded = jwt.verify(token, 'mysecretkey123jwt');
    const username = decoded.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added successfully" });

  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ message: "User not logged in" });
  }

  try {
    const decoded = jwt.verify(token, 'mysecretkey123jwt');
    const username = decoded.username;

    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Delete the review
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
