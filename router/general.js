const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username or password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  isbn = req.params.isbn;
  if (books[isbn]) {
    bookDetails = books[isbn];
    res.send(bookDetails);
  } else {
    return res
      .status(404)
      .json({ message: `Item with ISBN ${isbn} not found` });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let bookDetails = null;
  author = req.params.author;
  const bookIDS = Object.keys(books);
  for (const bookID of bookIDS) {
    const book = books[bookID];
    if (book.author.toLowerCase() === author.toLowerCase()) {
      newb = book;
      newb["isbn"] = bookID;
      delete newb["author"];
      bookDetails = newb;
    }
  }
  if (bookDetails) {
    res.send(bookDetails);
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let bookDetails = null;
  title = req.params.title;
  const bookIDS = Object.keys(books);
  for (const bookID of bookIDS) {
    const book = books[bookID];
    if (book.title.toLowerCase() === title.toLowerCase()) {
      newb1 = book;
      newb1["isbn"] = bookID;
      delete newb1["title"];
      bookDetails = newb1;
    }
  }
  if (bookDetails) {
    res.send(bookDetails);
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let review = null;
  isbn = req.params.isbn;
  if (books[isbn]) {
    review = books[isbn].reviews;
    res.send(review);
  } else {
    return res
      .status(404)
      .json({ message: `BOok with ISBN ${isbn} not found` });
  }
});

module.exports.general = public_users;
