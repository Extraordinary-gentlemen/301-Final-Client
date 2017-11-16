'use strict';

var app = app || {};

(function(module) {
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
        let carData = module.xmlToJson(results).vehicle;
        let cityMpg = Number(carData.city08['#text']);
        let hwyMpg = Number(carData.highway08['#text']);
        setup.myCar.mpg = {
          city: cityMpg,
          hwy: hwyMpg,
          avg: Math.round(((cityMpg + hwyMpg) / 2) * 10) / 10
        };
        module.setupView.$mpgInput.val(setup.myCar.mpg.avg);
      }, console.error)
  };

  $('#vehicle-setup form').on('submit', e => {
    e.preventDefault();
    setup.myCar.mpg = module.setupView.$mpgInput.val();
    setup.myCar.gal = $('input[name="gas-gallons"]').val();
    console.log(setup.myCar);
    // 3. grab user location
    // 4. Fire off request for location data from Joe
  });

  module.setup = setup;
})(app);

// TODO: event handler on form submit
// TODO: throw in a little page.js action
