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
    $yearSelect.append(`<option value="none">Year Not Listed</option>`);
  };

  setupView.loadMakes = makes => {
    for(let make of makes) {
      setupView.$makeSelect.append(`<option value="${make}">${make}</option>`)
    }
    setupView.$makeSelect.append(`<option value="none">Make Not Listed</option>`);
  };

  setupView.loadModels = models => {
    for(let model of models) {
      setupView.$modelSelect.append(`<option value="${model}">${model}</option>`)
    }
    setupView.$modelSelect.append(`<option value="none">Model Not Listed</option>`);
  };

  setupView.emptySelect = select => {
    let first = select.children().first();
    select.empty().append(first);
    console.log('emptying');
  };

  // $('select[name="vehicle-make"]').children().first().prop('selected', 'selected')

  $(() => {
    /* Page load initializations */
    setupView.loadYears();

    // Event Listeners
    $yearSelect.on('change', e => {
      let val = e.target.value;
      setupView.emptySelect(setupView.$makeSelect);
      setupView.emptySelect(setupView.$modelSelect);
      if(val && val !== 'none') { // Year Selected
        module.setup.myCar.year = val;
        module.setup.getMakes(val);
        console.log(`Nabbed ${val} makes.`);
      } else { // "Year not listed" or "Select Year" selected
        delete module.setup.myCar.year;
        if(val) { // "Year Not listed" selected
          console.log('Make this hide the select boxes!');
        }
      }
    });

    setupView.$makeSelect.on('change', e => {
      let val = e.target.value;
      setupView.emptySelect(setupView.$modelSelect);
      if(val && val !== 'none') { // Model Selected
        module.setup.myCar.make = val;
        module.setup.getModels(module.setup.myCar.year, val);
        console.log(`Nabbed ${module.setup.myCar.year} ${val} models`);
      } else { // "Model not listed" or "select model" selected
        delete module.setup.myCar.make;
        if(val) { // "Model not listed" selected
          console.log('Make this hide the select boxes!');
        }
      }
    });
  });

  module.setupView = setupView;
})(app);
