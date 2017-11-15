'use strict';

// Application Dependencies
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fetchJson = require('node-fetch-json');
const pg = require('pg');

const conString = 'postgres://postgres:1234@localhost:5432/postgres';
// const conString = 'postgres://localhost:5432';
const client = new pg.Client(conString);

// Application Setup
const app = express();
const PORT = process.env.PORT;

// Application Middleware
app.use(express.static('./public'));
app.use(cors());

// Client Request Endpoints
app.get('/', (req, res) => {
  res.sendFile('index.html')
});

// UNIX-Socket for connections
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
