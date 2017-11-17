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
  setup.getMakes = (year, setValue, data) => {
    $.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${year}`)
      .then(results => {
        module.setupView.loadMakes(setup.parseXML(results));
        module.setupView.$makeSelect.show();
        if(setValue) {
          module.setupView.$makeSelect.children().each(function() {
            if($(this).val() === data.make) {
              $(this).prop('selected', true);
            }
          });
          module.setup.getModels(data.year, data.make, true, data);
        }
      }, console.error);
  };

  // Get a list of all available vehicle models for given year and parse as an array
  setup.getModels = (year, make, setValue, data) => {
    $.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${year}&make=${make}`)
      .then(results => {
        module.setupView.loadModels(setup.parseXML(results));
        module.setupView.$modelSelect.show();
        if(setValue) {
          module.setupView.$modelSelect.children().each(function() {
            if($(this).val() === data.model) {
              $(this).prop('selected', true);
            }
          });
          module.setupView.$mpgInput.val(data.mpg);
        }
      }, console.error);
  };

  // Get the details for the specific car
  setup.getCar = (year, make, model) => {
    $.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`)
      .then(results => {
        setup.getMPG(setup.parseXML(results)[0]);
      }, console.error)
  };

  // Get the mpg for the specific car
  setup.getMPG = id => {
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

  module.setup = setup;
})(app);
