'use strict';

var app = app || {};

(function(module) {
  // Set the __API_URL__ for requests to the server
  let __API_URL__ = 'https://extraordinary-gentlemen.herokuapp.com';
  if(location.hostname !== 'pumpfinder.herokuapp.com') __API_URL__ = 'http://localhost:4000';

  // Get a list of all available vehicle years and parse as an array
  module.getMakes = year => { // eslint-disable-line
    $.get('https://www.fueleconomy.gov/ws/rest/vehicle/menu/year')
      .then(results => {
      module.xmlData = module.xmlToJson(results).menuItems.menuItem.map(obj => obj.text['#text']); // eslint-disable-line
      }, console.error);
  };

  // Test route to check communication with the API
  $.get(`${__API_URL__}/test`)
    .then( console.log, console.error);

})(app);
