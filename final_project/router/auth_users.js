const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.find( (x) => x.username === username) !== undefined;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.find( (x) => x.username === username);
  return user && user.password === password;
}

//Task 7
//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if( !username || !password ) return res.status(400).send("ERR: Missing Username or Password.");
  if( authenticatedUser(username, password) ){
    let accessToken = jwt.sign( {
      data: password
    }, 'access', {expiresIn: 60*60});
    req.session.authorization = {
      accessToken,username
    };
    return res.send(`${username} logged in successfully.`);
  } else{
    return res.status(403).send("Invalid login.");
  }
});

//Task 8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const username = req.session.authorization.username;
  if(!username) return res.status(401).send("ERR: You must login to gain access.");
  if( isbn && isbn > 0 ){
    const book = books[isbn];
    const review = req.query.review;
    if(!review)return res.status(400).send("ERR: No review provided.");
    if(!book)return res.status(404).send(`ERR: Book associated with ${isbn} not found`);
    book.reviews[username] = review;
    return res.json({user:username, review: review});

  } else{ 
    return res.status(400).send("ERR: Invalid ISBN")
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
