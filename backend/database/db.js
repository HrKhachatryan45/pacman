require('dotenv').config();
const knex = require('knex');
const knexConfig = require('../knex.config')

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

module.exports = db;