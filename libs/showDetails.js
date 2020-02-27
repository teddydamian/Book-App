'use strict';

function showDetails(request, response){
  console.log(request.body);
  response.render('/pages/books/show.ejs', {bookObj: request.body, endpoint:'/books',});
}

module.exports = showDetails;
