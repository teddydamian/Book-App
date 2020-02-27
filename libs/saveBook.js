'use strict';
const client = require('./client');

function saveBook(request, response){
  let sql = 'INSERT INTO books (title, author, book_description, categories, isbn_10, isbn_13) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
  console.log('body', request.body);
  // let sql = 'INSERT INTO book (title, book_description, author, img_link, isbn_10, isbn_13, categories) VALUES ($1, $2, $3, $4, $5, $6) WHERE NOT EXISTS (SELECT * FROM book WHERE isbn_10 = $5);';
  let {title, author, book_description, categories, isbn_10, isbn_13,} = request.body;
  let safeValues = [title, author, book_description, categories, isbn_10, isbn_13];
  client.query(sql, safeValues)
    .then( () => {
      response.redirect('/');
      // response.render('pages/books/detail.ejs', {bookObj: results.rows,});
    }).catch(error => console.log('save error', error));
}

module.exports = saveBook;
