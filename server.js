'use strict';

const client = require('./libs/client');

const express = require('express');
const app = express();
require('ejs');
const superagent = require('superagent');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

require('dotenv').config();

const PORT = process.env.PORT || 3001;

// app.get('/hello', (request, response) => {
//   response.render('pages/index.ejs');
// });

app.get('/', sendSearchForm);

function sendSearchForm(request, response){
  response.render('pages/index.ejs');
}

app.post('/searches', collectFormData);

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

  console.log(url);
  superagent.get(url)
    .then(results => {
      let resultsArray = results.body.items;
      // console.log(resultsArray);
      const finalArray = resultsArray.map(book => {
        return new Book(book.volumeInfo);
      });
      console.log(finalArray);
      response.render('pages/searches/show.ejs', {bananas: finalArray,});
    });
}

function Book(obj){
  this.title = obj.title || 'no title available';
  console.log(this.title);
}

client.connect()
  .then(
    app.listen(PORT, () => console.log(`listening on ${PORT}`))
  );

