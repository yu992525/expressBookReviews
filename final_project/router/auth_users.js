const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
const authenticatedUser = (username, password) => {
  // Check if username and password match the one we have in our records
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
}
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Direct check against the users array instead of calling an outside function
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (validusers.length > 0) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // Get review from the URL query (?review=text)
  const username = req.session.authorization.username; // Get username from session

  if (books[isbn]) {
      let book = books[isbn];
      // If the user already has a review, this will overwrite it.
      // If not, it creates a new entry under their username.
      book.reviews[username] = review;
      return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username; // Get username from session

  if (books[isbn]) {
      let book = books[isbn];
      
      // Check if this specific user has a review for this book
      if (book.reviews[username]) {
          delete book.reviews[username]; // Remove the review for this user
          return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`);
      } else {
          return res.status(404).json({message: "Review not found for this user"});
      }
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
