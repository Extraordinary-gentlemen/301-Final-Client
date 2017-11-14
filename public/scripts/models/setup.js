'use strict';

var app = app || {};

(function(module) {
  // Set the __API_URL__ for requests to the server
  let __API_URL__ = 'https://extraordinary-gentlemen.herokuapp.com';
  if(location.hostname !== 'pumpfinder.herokuapp.com') __API_URL__ = 'http://localhost:4000';

  // Establishing the setup object
  const setup = {};

  setup.parseXML = xml => module.xmlToJson(xml).menuItems.menuItem.map(obj => obj.text['#text']);

  // Get a list of all available vehicle years and parse as an array
  setup.getMakes = year => { // eslint-disable-line
    $.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${year}`)
      .then(results => setup.makes = setup.parseXML(results), console.error);
  };

  // Test route to check communication with the API
  $.get(`${__API_URL__}/test`)
    .then( console.log, console.error);

  module.setup = setup;
})(app);
