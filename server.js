const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();

//const db = require('./db'); //db.js file to run everytime our server starts

const request = require('request');
const Promise = require('bluebird');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static(__dirname + '/../client/dist'));

// ======================================================================
//                    Run Server
// ======================================================================

app.listen(PORT, () =>{
  console.log('Listening on port', PORT);
});

// module.exports = app.listen(PORT, function () {
//     console.log(`listening on port ${PORT}!`);
// });