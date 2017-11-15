'use strict';

var app = app || {};

(function(module) {
  // Set the __API_URL__ for requests to the server
  // let __API_URL__ = 'https://extraordinary-gentlemen.herokuapp.com'; // eslint-disable-line
  // if(location.hostname !== 'pumpfinder.herokuapp.com') __API_URL__ = 'http://localhost:4000';

  // Establishing the setup object
  const setup = {};
  setup.myCar = {};

  // Convert returned xml data into an array of strings
  setup.parseXML = xml => {
    let data = module.xmlToJson(xml).menuItems.menuItem;
    if(!Array.isArray(data)) data = [data];
    return data.map(obj => obj.value['#text']);
  };

  // Get a list of all available vehicle makes and parse as an array
  setup.getMakes = year => {
    $.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${year}`)
      .then(results => {
        module.setupView.loadMakes(setup.parseXML(results));
        module.setupView.$makeSelect.show();
      }, console.error);
  };

  // Get a list of all available vehicle models for given year and parse as an array
  setup.getModels = (year, make) => {
    $.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${year}&make=${make}`)
      .then(results => {
        module.setupView.loadModels(setup.parseXML(results));
        module.setupView.$modelSelect.show();
      }, console.error);
  };

  // Get the details for the specific car
  setup.getCar = (year, make, model) => {
    $.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`)
      .then(results => {
        // TODO: Some cars return multiple options. Do we want to take that into account? Currently ignored.
        setup.getMPG(setup.parseXML(results)[0]);
      }, console.error)
  };

  // Get the mpg for the specific car
  setup.getMPG = id => { // eslint-disable-line
    $.get(`https://www.fueleconomy.gov/ws/rest/vehicle/${id}`)
      .then(results => {
        // TODO: Some cars return multiple options. Do we want to take that into account? Currently ignored.
        let carData = module.xmlToJson(results).vehicle;
        let cityMpg = Number(carData.city08['#text']);
        let hwyMpg = Number(carData.highway08['#text']);
        setup.myCar.mpg = {
          city: cityMpg,
          hwy: hwyMpg,
          avg: (cityMpg + hwyMpg) / 2
        };
        module.setupView.$mpgInput.val(setup.myCar.mpg.avg);
      }, console.error)
  };

  // Test route to check communication with the API
  // $.get(`${__API_URL__}/test`)
  //   .then( console.log, console.error);

  module.setup = setup;
})(app);


// TODO: jquery hide and show the selects
// TODO: modify inputs so min number is 0 allow floats (see S.O.)
// TODO: Look into fancier jQuery for showing the pieces, like slide?
// TODO: Add some sort of recursive callback for refetching on fail, but increment (max 3 tries)
// TODO: event handler on form submit
// TODO: throw in a little page.js action
