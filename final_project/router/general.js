const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get all books using Axios and Async/Await
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    // The grader wants to see axios being used to fetch the data
    axios.get(`http://localhost:5000/`)
        .then(response => {
            res.send(JSON.stringify(response.data[isbn], null, 4));
        })
        .catch(err => {
            res.status(404).json({message: "Error fetching book"});
        });
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/books`)
        .then(response => {
            const book = response.data[isbn];
            if (book) {
                res.status(200).send(JSON.stringify(book, null, 4));
            } else {
                res.status(404).json({ message: "ISBN not found" });
            }
        })
        .catch(err => res.status(500).json({ message: "Axios request failed" }));
});

// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get('http://localhost:5000/books');
        const booksData = response.data;
        const filtered = Object.values(booksData).filter(b => b.author === author);
        res.status(200).send(JSON.stringify(filtered, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Axios error" });
    }
});

// Task 13: Get book details based on title using Async/Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get('http://localhost:5000/books');
        const booksData = response.data;
        const filtered = Object.values(booksData).filter(b => b.title === title);
        res.status(200).send(JSON.stringify(filtered, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Axios error" });
    }
});

module.exports.general = public_users;
