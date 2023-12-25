const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");

const authUsersRouter = express.Router();
const users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

authUsersRouter.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const present = users.some((user) => user.username === username);

    if (!present) {
      users.push({ "username": username, "password": password });
      return res.status(201).json({ message: "User Created successfully" });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  } else {
    return res.status(400).json({ message: "Bad request. Check username and password" });
  }
});

authUsersRouter.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  const accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });
  req.session.authorization = { accessToken };
  res.send("User logged in Successfully");
});

authUsersRouter.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.data;
  const ISBN = req.params.isbn;
  const details = req.query.review;
  const review = { user: username, review: details };
  books[ISBN].reviews = review;
  return res.status(201).json({ message: "Review added successfully" });
});

authUsersRouter.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  books[ISBN].reviews = {};
  return res.status(200).json({ message: "Review has been deleted" });
});

module.exports = {
  authUsersRouter,
  isValid,
  users
};
