'use strict';

var app = app || {};

(function(module) {
  // Set the __API_URL__ for requests to the server
  let __API_URL__ = 'https://extraordinary-gentlemen.herokuapp.com'; // eslint-disable-line
  if(location.hostname !== 'pumpfinder.herokuapp.com') __API_URL__ = 'http://localhost:4000';

  // Establishing the setup object
  const setup = {};
  setup.myCar = {};


  setup.parseXML = xml => {
    let data = module.xmlToJson(xml).menuItems.menuItem;
    if(!Array.isArray(data)) data = [data];
    return data.map(obj => obj.text['#text']);
  };

  // Get a list of all available vehicle makes and parse as an array
  setup.getMakes = year => { // eslint-disable-line
    $.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${year}`)
      .then(results => {
        module.setupView.loadMakes(setup.parseXML(results));
      }, console.error);
  };

  // Get a list of all available vehicle years and parse as an array
  setup.getModels = (year, make) => { // eslint-disable-line
    $.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${year}&make=${make}`)
      .then(results => {
        console.log(module.xmlToJson(results));
        module.setupView.loadModels(setup.parseXML(results));
      }, console.error);
  };




  // Test route to check communication with the API
  // $.get(`${__API_URL__}/test`)
  //   .then( console.log, console.error);

  module.setup = setup;
})(app);
