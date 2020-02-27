'use strict';

require('dotenv').config();
const client = require('./libs/client');

const express = require('express');
const app = express();
require('ejs');
const superagent = require('superagent');
const methodOverride = require('method-override');


// local funcs
const saveBook = require('./libs/saveBook');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true,}));
app.use(express.static('./public'));
app.use(methodOverride('_method'));

const PORT = process.env.PORT || 3001;

// app.get('/hello', (request, response) => {
//   response.render('pages/index.ejs');
// });

app.get('/', sendSearchForm);
app.get('/error', serveErrorPage);
app.post('/searches', collectFormData);
// app.post('/show', injectBook);
app.post('/detail', showDetails);
app.get('/books/:id', getOneBook);
app.post('/books', saveBook);

// function saveBook(request, response){
//   let sql = 'INSERT INTO books (title, author, book_description, categories, isbn_10, isbn_13) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
//   // let sql = 'INSERT INTO book (title, book_description, author, img_link, isbn_10, isbn_13, categories) VALUES ($1, $2, $3, $4, $5, $6) WHERE NOT EXISTS (SELECT * FROM book WHERE isbn_10 = $5);';
//   let {title, author, book_description, categories, ISBN_10, ISBN_13,} = request.body;
//   let safeValues = [title, author, book_description, categories, ISBN_10, ISBN_13];
//   client.query(sql, safeValues)
//     .then( results => {
//       response.redirect('/');
//       // response.render('pages/books/detail.ejs', {bookObj: results.rows,});
//     }).catch(error => console.log('save error', error));
// }

function showDetails(request, response){
  response.render('pages/books/show.ejs', {bookObj: request.body,});
}




function getOneBook(request, response){
  let id = request.params.id;
  let sql = 'SELECT * FROM books WHERE id=$1;';
  let safeValues = [id];

  client.query(sql, safeValues)
    .then(results => {
      let book = results.rows[0];
      response.render('pages/books/detail.ejs', {bookObj: book,});
    });
}


// function injectBook(response, request){

// }

function sendSearchForm(request, response){
  let sql = 'SELECT * FROM books;';

  client.query(sql)
    .then(results =>{
      let books = results.rows;

      response.render('pages/index.ejs', {bookArray: books,});
    });
}


function collectFormData(request, response){
  let formData = request.body.search;
  let nameOfBookOrAuthor = formData[0];
  let isAuthorOrTitle = formData[1];

  let url = `https://www.googleapis.com/books/v1/volumes?q=`;

  if(isAuthorOrTitle === 'title'){
    url += `+intitle:${nameOfBookOrAuthor}`;
  } else if (isAuthorOrTitle === 'author'){
    url += `+inauthor:${nameOfBookOrAuthor}`;
  }

  superagent.get(url)
    .then(results => {
      let resultsArray = results.body.items;
      const finalArray = resultsArray.map(book => {
        return new Book(book.volumeInfo);
      });
      response.render('pages/searches/show.ejs', {bookObj: finalArray,});
    }
    );
}

function serveErrorPage(request, response){
  response.render('pages/error.ejs');
}

function Book(obj){
  if(obj.industryIdentifiers){
    obj.industryIdentifiers.forEach( val => {
      this[val.type] = val.identifier;
    });
  }
  this.title = obj.title || 'no title available';
  // this.description = obj.description;
  // this.title = obj.title || 'No title available';
  // make an 'authors' string that has proper comma and spaces
  this.author = obj.authors && obj.authors.length > 0 ? obj.authors.reduce ((acc, val, ind, arr) =>
  { acc += ind !== 0 && ind < arr.length ? ', ' : '';
    return acc += `${val}`;} ,'') : 'No Author Available';

  this.book_description = obj.description || obj.book_description || 'No Description Available';

  this.image = obj.imageLinks !== undefined ? obj.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
  this.id = obj.id || '';
  this.categories = obj.categories && obj.categories.length > 0 ? obj.categories.reduce ((acc, val, ind, arr) =>
  { acc += ind !== 0 && ind < arr.length ? ', ' : '';
    return acc += `${val}`;} ,'') : 'No Categories Available';

  this.isbn_10 = obj.ISBN_10 || 0;
  this.isbn_13 = obj.ISBN_13 || 0;
  console.log(this);
}

client.connect()
  .then(
    app.listen(PORT, () => console.log(`listening on ${PORT}`))
  ).catch(
    (error) => console.log('Restart Postgresql', error));
