const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
 if(users[username]) return false;
  return true;
} 

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  if(users[username] && users[username].password === password) return true;
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }
  const authenticated = authenticatedUser(username, password);
  if(!authenticated){
    return res.status(401).json({message: "Invalid username or password"});
  }
  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
  req.session.token = token;
  return res.status(200).json({message: "Login successful", token});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  if(!isbn || !review){
    return res.status(400).json({message: "ISBN and review are required"});
  }
  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }
  const username = req.user.username;
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({message: "Book review added successfully"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if(!isbn){
    return res.status(400).json({message: "ISBN is required"});
  }
  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }
  const username = req.user.username;
  if(!books[isbn].reviews[username]){
    return res.status(404).json({message: "Review not found"});
  }
  books[isbn].reviews[username] = undefined;
  return res.status(200).json({message: "Book review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
