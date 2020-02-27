'use strict';
const client = require('./client');

function updateBook(request, response){
  let {title, book_description, img_link, isbn_10, isbn_13, author} = request.body;
  let id = request.params.id;
  let sql = 'UPDATE books SET title=$1, book_description=$2, img_link=$3, isbn_10=$4, isbn_13=$5, author=$6 WHERE id=$7;';
  let safeValues = [title, book_description, img_link, isbn_10, isbn_13, author, id];

  client.query(sql, safeValues)
    .then(() => {
      response.redirect('/');
    });
}

module.exports = updateBook;
