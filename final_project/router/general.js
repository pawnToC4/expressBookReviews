const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Task 6
public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if( !username ) return res.status(400).send("ERR: Username not provided.")
  if( isValid(username) ){
    return res.status(400).send(`ERR: Username "${username}" already exists.`)
  }else{
    if( !password ) return res.status(400).send("ERR: Password not provided.")
    users.push( {username:username, password:password} );
    return res.send(`Registered user "${username}".`);
  }

});

//Task 1
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books))
  return res.status(200).json({message: "Returned Book listing."});
});

//Task 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  if( isbn && isbn > 0){
    console.log(Object.keys(books));
    if( Object.keys(books).includes(`${isbn}`)){
      res.send(JSON.stringify(books[`${isbn}`]));
    }else{
      res.status(404).send("ERR: ISBN not found.");
    }
  }else{
    res.status(400).send("ERR: Invalid ISBN")
  }
 });
  
//Task 3
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const authorBooks = [];
  for (const [key, value] of Object.entries(books)){
    const valueAuthor = value.author.replaceAll(/ /g, "");
    //DEV NOTE:Using user input as a RegExp w/o performing necessary escapes can be a security threat. 
    const authorRE = new RegExp(author, "i");
    if( authorRE.test(valueAuthor) ){
      let obj = {};
      obj[key] = value;
      authorBooks.push(obj);
    }
  }
  if(authorBooks.length > 0){
    return res.send(authorBooks);
  }else{
    return res.status(404).send(`ERR: No books found for ${author}.`);
  }
  
});

//Task 4
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const titles = [];
  for( const [key, value] of Object.entries(books)){
    const valueTitle = value.title.replaceAll(/ /g, "");
    const titleRE = new RegExp(title, "i");
    if( titleRE.test(valueTitle) ){
      let obj = {};
      obj[key] = value;
      titles.push(obj);
    }
  }
  if( titles.length > 0 ){
    return res.send(titles);
  }else{
    return res.status(404).send(`ERR: No titles found for ${title}.`);
  }
});

//Task 5
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const isbnValue = parseInt(isbn);
  if( isbnValue && isbnValue > 0 ){
    if( Object.keys(books).includes(isbn)){
      let review = books[isbnValue].reviews;
      if(!review || Object.keys(review).length ===  0) review = "none";
      return res.send(`Reviews for ${books[isbnValue].title}: ${JSON.stringify(review)}`);
    } else{
      return res.status(404).send(`ERR: ISBN ${isbn} not found.`);
    }
  } else{
    return res.status(400).send(`ERR: Invalid ISBN.`)
  }
});

module.exports.general = public_users;
