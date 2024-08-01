const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const LOCAL_API_URL = 'http://localhost:5000/'

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  //check if username and password are not empty
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  //check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }
  //write code to check if username and password match the one we have in records.
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });

  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  //Write your code here
  //* return res.status(200).json(books);
  try {
    const response = await axios.get(LOCAL_API_URL); 
    return res.status(200).json(response.data); 
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get books', error: error.message });
  }
  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  // const book = books[isbn];
  // if (book) {
  //   return res.status(200).json(book);
  // } else {
  //   return res.status(404).json({ message: "Book not found" });
  // }
  try {
    const response = await axios.get(`${LOCAL_API_URL}/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: 'Book not found', error: error.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  //Write your code here
  const author = req.params.author;
  // const filteredBooks = Object.values(books).filter(book => book.author === author);
  // if (filteredBooks.length > 0) {
  //   return res.status(200).json(filteredBooks);
  // } else {
  //   return res.status(404).json({ message: "No books found by this author" });
  // }
  try {
    const response = await axios.get(`${LOCAL_API_URL}/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: 'No books found by this author', error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  //Write your code here
  const title = req.params.title;
  // const filteredBooks = Object.values(books).filter(book => book.title === title);
  // if (filteredBooks.length > 0) {
  //   return res.status(200).json(filteredBooks);
  // } else {
  //   return res.status(404).json({ message: "No books found with this title" });
  // }
  try {
    const response = await axios.get(`${LOCAL_API_URL}/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: 'No books found with this title', error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  // const book = books[isbn];
  // if (book && book.reviews) {
  //   return res.status(200).json(book.reviews);
  // } else {
  //   return res.status(404).json({ message: "No reviews found for this book" });
  // }
  try {
    const response = await axios.get(`${LOCAL_API_URL}/review/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: 'No reviews found for this book', error: error.message });
  }
});

module.exports.general = public_users;
