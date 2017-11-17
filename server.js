'use strict';
// Application Dependencies
const express = require('express');
const cors = require('cors');

// Application Setup
const app = express();
const PORT = process.env.PORT;

// Application Middleware
app.use(express.static('./public'));
app.use(cors());

// Client Request Endpoints
app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

// UNIX-Socket for connections
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
