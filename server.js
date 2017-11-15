'use strict';

// Application Dependencies
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fetchJson = require('node-fetch-json');
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

app.get('/api/v1/markers/*', (req, res) => {
  fetchJson(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=gas+stations&location=${req.params[0]}&radius=40&key=AIzaSyB6PFCWQQvDJQhVpPL6PqM3W7ZcywGO1KU`)
    .then(response => {
      res.send(response.results.map(function(x){
        return { lat: x.geometry.location.lat, lng: x.geometry.location.lng };
      }));
    });
});




// fetchJson('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=47.6060443,-122.3239966&destinations=47.63585519999999,-122.3756461&key=AIzaSyB6PFCWQQvDJQhVpPL6PqM3W7ZcywGO1KU')
// .then(response => console.log(JSON.stringify(response)));






// UNIX-Socket for connections
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
