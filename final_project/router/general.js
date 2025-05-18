const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }
  if(users[username]){
    return res.status(400).json({message: "User already exists"});
  }
  users[username] = {username, password};
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  if(booksByAuthor.length === 0){
    return res.status(404).json({message: "No books found by this author"});
  }
  return res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  if(booksByTitle.length === 0){
    return res.status(404).json({message: "No books found with this title"});
  }
  return res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }
  const book = books[isbn];
  if(!book.reviews || Object.keys(book.reviews).length === 0){
    return res.status(404).json({message: "No reviews found for this book"});
  }
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
