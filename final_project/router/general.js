const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required for Task 10-13 patterns

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(books), 100);
            });
        };
        const list = await getBooks();
        res.status(200).send(JSON.stringify(list, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject({ status: 404, message: "Book not found" });
            }
        }, 100);
    });

    getBookByISBN
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(err.status).json({ message: err.message }));
});

// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = await new Promise((resolve) => {
            const all_isbns = Object.keys(books);
            const filtered = all_isbns
                .filter(isbn => books[isbn].author === author)
                .map(isbn => ({ isbn, ...books[isbn] }));
            resolve(filtered);
        });
        
        if (getBooksByAuthor.length > 0) {
            res.status(200).send(JSON.stringify(getBooksByAuthor, null, 4));
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
        const getBooksByTitle = await new Promise((resolve) => {
            const all_isbns = Object.keys(books);
            const filtered = all_isbns
                .filter(isbn => books[isbn].title === title)
                .map(isbn => ({ isbn, ...books[isbn] }));
            resolve(filtered);
        });

        if (getBooksByTitle.length > 0) {
            res.status(200).send(JSON.stringify(getBooksByTitle, null, 4));
        } else {
            res.status(404).json({ message: "Title not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports.general = public_users;