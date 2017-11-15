'use strict';

var app = app || {};

(function(module){ //eslint-disable-line
  // Setup Constants
  const setupView = {};
  const $yearSelect = $('select[name="vehicle-year"]');
  setupView.$makeSelect = $('select[name="vehicle-make"]');
  setupView.$modelSelect = $('select[name="vehicle-model"]');

  setupView.loadYears = () => {
    for(let i = 2018; i > 1983; i--) {
      $yearSelect.append(`<option value="${i}">${i}</option>`);
    }
    $yearSelect.append(`<option value="no-year">Year Not Listed</option>`);
  };

  setupView.loadSpec = (list, makes) => {
    for(let make of makes) {
      list.append(`<option value="${make}">${make}</option>`)
    }
    list.append(`<option value="none">Make Not Listed</option>`);
  };

  // setupView.loadModels = (models) => {
  //   for(let model of models) {
  //     $modelsSelect.append(`<option value="${model}">${model}</option>`)
  //   }
  //   $modelsSelect.append(`<option value="none">Model Not Listed</option>`);
  // };

  $(() => {
    /* Page load initializations */
    setupView.loadYears();

    // Event Listeners
    $yearSelect.on('change', e => {
      let val = e.target.value;
      module.setup.myCar.year = val;
      if(val && val !== 'none') {
        module.setup.getMakes(val);
        console.log(`Nabbed ${val} makes @ app.setup.makes`);
      } else if(val) {
        console.log('Make this hide the select boxes!');
      }
    });

    setupView.$makeSelect.on('change', e => {
      let val = e.target.value;
      module.setup.myCar.make = val;
      if(val && val !== 'none') {
        module.setup.getModels(module.setup.myCar.year, val);
        console.log(`Nabbed ${module.setup.myCar.year} ${val} models @ app.setup.models`);
      } else if(val) {
        console.log('Make this hide the select boxes!');
      }
    });
  });

  module.setupView = setupView;
})(app);
