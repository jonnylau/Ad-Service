var environment = process.env.NODE_ENV || 'development';
var config = require('../knexfile.js')[environment];
module.exports = require('knex')(config);   

/*
const pg = require('pg');
const config = require('../knexfile.js');
    -> password, client, DB
const dev = 'development';
const prod = 'production';
let knex = require('knex')(config[dev]);
const bookshelf = require('bookshelf')(knex);
const _ = require('lodash');
const Promise = require('bluebird');
const categoryList = require('../category_map.json');
const moment = require('moment');
*/