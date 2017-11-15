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

app.get('/api/v1/markers/*', (req, res) => {
  fetchJson(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=gas+stations&location=${req.params[0]}&radius=40&key=AIzaSyB6PFCWQQvDJQhVpPL6PqM3W7ZcywGO1KU`)
    .then(response => {
      res.send(response.results.map(function(x){
        return { lat: x.geometry.location.lat, lng: x.geometry.location.lng, address: x.formatted_address, name: x.name };
      }));
    });
});





// fetchJson('https://maps.googleapis.com/maps/api/place/textsearch/json?query=gas+stations&location=47.6060443,-122.3239966&radius=40&key=AIzaSyA9n7ppgHwnbH3ltGMaGp2WpZcuocmiZdU')
// .then(response => {
//   let empt = JSON.stringify(response.results.map(function(x){ return { lat: x.geometry.location.lat, lng: x.geometry.location.lng, address: x.formatted_address, name: x.name } }))
// });

// sql useful for insertion
// INSERT INTO gasstations (name, address, price)
// VALUES ('arco', '123 fuck street', '23.34');


// ALTER TABLE gasstations
// // ADD lat VARCHAR(20)
// ADD long VARCHAR(20);
//
// ALTER TABLE gasstations
// ADD long VARCHAR(20);
//
//
//
// UPDATE gasstations
// SET lat = '41.12434', long = '51.12345'
// WHERE id=1;

//
// fetchJson('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=47.6060443,-122.3239966&destinations=47.63585519999999,-122.3756461&key=AIzaSyB6PFCWQQvDJQhVpPL6PqM3W7ZcywGO1KU')
// .then(response => console.log(JSON.stringify(response)));
//

// fetchJson('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=47.6060443,-122.3239966&destinations=47.63585519999999,-122.3756461&key=AIzaSyB6PFCWQQvDJQhVpPL6PqM3W7ZcywGO1KU')
// .then(response => console.log(JSON.stringify(response)));


// UNIX-Socket for connections
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
