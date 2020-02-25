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


client.connect()
  .then(
    app.listen(PORT, () => console.log(`listening on ${PORT}`))
  );
