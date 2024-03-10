const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const user = req.body.username;
  if (!user) {
    return res.status(404).json({ message: "Need username to login" });
  }
  let accessToken = jwt.sign(
    {
      data: user,
    },
    "access",
    { expiresIn: 60 * 60 }
  );
  req.session.authorization = {
    accessToken,
  };
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!req.session.authorization || !req.session.authorization.accessToken) {
    return res.status(401).json({ message: "User not logged in" });
  }
  const username = jwt.verify(
    req.session.authorization.accessToken,
    "access"
  ).data;

  if (!username) {
    return res.status(401).json({ message: "Invalid user" });
  }
  if (!isbn || !review) {
    return res.status(400).json({ message: "ISBN and review are required" });
  }
  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(201).json({
      message: `Review for book with ISBN ${isbn} is updated or modified`,
    });
  } else {
    return res
      .status(404)
      .json({ message: `Item with ISBN ${isbn} not found` });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  isbn = req.params.isbn;

  if (!req.session.authorization || !req.session.authorization.accessToken) {
    return res.status(401).json({ message: "User not logged in" });
  }
  const username = jwt.verify(
    req.session.authorization.accessToken,
    "access"
  ).data;

  if (!username) {
    return res.status(401).json({ message: "Invalid user" });
  }
  if (!books[isbn]) {
    return res.status(404).json({ error: "Book not found" });
  }
  delete books[isbn].reviews[username];
  res.json({
    message: `Review for ISBN ${isbn} posted by user deleted successfully`,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
