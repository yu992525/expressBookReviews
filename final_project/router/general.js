const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();
const axios = require('axios'); // Required library for Tasks 10-13

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    // Simulating an external API call using a Promise wrapper
    const getBooks = () => new Promise((resolve) => resolve(books));
    const list = await getBooks();
    res.status(200).send(JSON.stringify(list, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  // Creating a promise to handle the ISBN lookup asynchronously
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBook
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    // Filtering books by author within an async-await pattern
    const getByAuthor = await new Promise((resolve) => {
      const filtered = Object.values(books).filter(b => b.author === author);
      resolve(filtered);
    });
    
    if (getByAuthor.length > 0) {
      res.status(200).send(JSON.stringify(getByAuthor, null, 4));
    } else {
      res.status(404).json({ message: "Author not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Task 13: Get book details based on title using async-await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    // Filtering books by title using an asynchronous promise
    const getByTitle = await new Promise((resolve) => {
      const filtered = Object.values(books).filter(b => b.title === title);
      resolve(filtered);
    });

    if (getByTitle.length > 0) {
      res.status(200).send(JSON.stringify(getByTitle, null, 4));
    } else {
      res.status(404).json({ message: "Title not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports.general = public_users;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports.general = public_users;
