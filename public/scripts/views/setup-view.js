'use strict';

var app = app || {};

(function(module){ //eslint-disable-line
  // Setup Constants
  const setupView = {};
  setupView.$yearSelect = $('select[name="vehicle-year"]');
  setupView.$makeSelect = $('select[name="vehicle-make"]');
  setupView.$modelSelect = $('select[name="vehicle-model"]');
  setupView.$mpgInput = $('input[name="vehicle-mpg"]');
  const $noVehicleWarning = $('#no-vehicle-warning');

  setupView.loadYears = () => {
    for(let i = 2018; i > 1983; i--) {
      setupView.$yearSelect.append(`<option value="${i}">${i}</option>`);
    }
    setupView.$yearSelect.append(`<option value="none">Year Not Listed</option>`);
  };

  setupView.loadMakes = makes => {
    for(let make of makes) {
      setupView.$makeSelect.append(`<option value="${make}">${make}</option>`)
    }
    setupView.$makeSelect.show();
  };

  setupView.loadModels = models => {
    for(let model of models) {
      setupView.$modelSelect.append(`<option value="${model}">${model}</option>`)
    }
    setupView.$modelSelect.show();
  };

  setupView.emptySelect = select => {
    let $first = select.children().first();
    let $second = $first.next();
    select.empty().append($first).append($second);
    $first.prop('selected', true);
  };

  setupView.hideSelects = () => {
    setupView.$modelSelect.hide();
    setupView.$makeSelect.hide();
    setupView.$yearSelect.children().first().prop('selected', true);
    $noVehicleWarning.show();
    module.setup.myCar = {};
  };


  // Page load initializations
  $(() => {
    setupView.loadYears();
    setupView.$makeSelect.hide().removeClass('hide');
    setupView.$modelSelect.hide().removeClass('hide');
    $noVehicleWarning.hide().removeClass('hide');

    // Event Listeners
    setupView.$yearSelect.on('change', e => {
      window.location.href = '#vehicle-form';
      $noVehicleWarning.hide();
      let val = e.target.value;
      setupView.emptySelect(setupView.$makeSelect);
      setupView.emptySelect(setupView.$modelSelect);
      setupView.$modelSelect.hide();
      setupView.$mpgInput.val('');
      module.setup.myCar = {};
      if(val && val !== 'none') { // Year Selected
        module.setup.myCar.year = val;
        module.setup.getMakes(val);
      } else if(val) { // "Year Not listed" selected
        setupView.hideSelects();
      } else {
        setupView.$makeSelect.hide();
      }
      console.log(module.setup.myCar); // TODO: take out later
    });

    setupView.$makeSelect.on('change', e => {
      let val = e.target.value;
      setupView.emptySelect(setupView.$modelSelect);
      // setupView.$modelSelect.hide();
      setupView.$mpgInput.val('');
      module.setup.myCar = {year: module.setup.myCar.year};
      if(val && val !== 'none') { // Model Selected
        module.setup.myCar.make = val;
        module.setup.getModels(module.setup.myCar.year, val);
      } else if(val) { // "Model not listed" selected
        setupView.hideSelects();
      }
      console.log(module.setup.myCar);
    });

    setupView.$modelSelect.on('change', e => {
      let val = e.target.value;
      setupView.$mpgInput.val('');
      delete module.setup.myCar.model;
      delete module.setup.myCar.mpg;
      if(val && val !== 'none') { // Model Selected
        module.setup.myCar.model = val;
        module.setup.getCar(module.setup.myCar.year, module.setup.myCar.make, val);
      } else if(val) { // "Model not listed" selected
        setupView.hideSelects();
      }
      console.log(module.setup.myCar);
    });
  });

  $('#vehicle-setup form').on('submit', e => {
    e.preventDefault();
    module.setup.myCar.mpg = module.setupView.$mpgInput.val();
    module.setup.myCar.gal = $('input[name="gas-gallons"]').val();
    console.log(module.setup.myCar);
    localStorage.myCar = module.setup.myCar;
    let message = `To find the cheapest gas stations, we need to use your location.

      Do you consent?`;
    if(confirm(message)) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        module.queryApi(lat, lng);
      });
    } else {
      console.log('No GPS data.');
    }
  });

  module.setupView = setupView;
})(app);
