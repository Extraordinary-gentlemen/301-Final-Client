'use strict';

var app = app || {};

(function(module){
  // Set the __API_URL__ for requests to the server
  let __API_URL__ = 'https://extraordinary-gentlemen.herokuapp.com';
  if(location.hostname !== 'pumpfinder.herokuapp.com') __API_URL__ = 'http://localhost:4000';

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

  setupView.getUserInput = (input) => {
    $.get(`${__API_URL__}/api/v1/userinput/${input}`)
      .then(results => {
        module.lat = results.lat;
        module.lng = results.lng;
        module.queryApi(module.lat, module.lng);
      }, console.error);
  }

  setupView.setSavedState = () => {
    if(!localStorage.myCar) return;
    let savedData = JSON.parse(localStorage.myCar);
    if(savedData.make) {
      setupView.$yearSelect.children().each(function() {
        if($(this).val() === savedData.year) {
          $(this).prop('selected', true);
        }
      });
      module.setup.getMakes(savedData.year, true, savedData);
    } else if(savedData && !savedData.make) {
      // TODO: Fix flashy warning glitch
      $noVehicleWarning.removeClass('hide').show();
      setupView.$mpgInput.val(savedData.mpg);
    }
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
        module.setup.getMakes(val, false);
      } else if(val) { // "Year Not listed" selected
        setupView.hideSelects();
      } else {
        setupView.$makeSelect.hide();
      }
    });

    setupView.$makeSelect.on('change', e => {
      let val = e.target.value;
      setupView.emptySelect(setupView.$modelSelect);
      setupView.$mpgInput.val('');
      module.setup.myCar = {year: module.setup.myCar.year};
      if(val && val !== 'none') { // Model Selected
        module.setup.myCar.make = val;
        module.setup.getModels(module.setup.myCar.year, val, false);
      } else if(val) { // "Model not listed" selected
        setupView.hideSelects();
      }
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
    });

    $('#vehicle-setup form').on('submit', e => {
      e.preventDefault();
      module.setup.myCar.mpg = module.setupView.$mpgInput.val();
      module.setup.myCar.gal = $('input[name="gas-gallons"]').val();
      localStorage.myCar = JSON.stringify(module.setup.myCar);
      let message = `May we use your location to find your cheap gas?`;
      if(confirm(message)) {
        navigator.geolocation.getCurrentPosition(function(position) {
          module.lat = position.coords.latitude;
          module.lng = position.coords.longitude;
          module.queryApi(module.lat, module.lng);
        });
      } else {
        let loc = '';
        while(!loc || !loc.replace(/ /g, '') || null) {
          loc = prompt('Where ya at?');
        }
        setupView.getUserInput(encodeURI(loc.trim()));
      }
      $('#store-list, #map').empty();
      $('#saved-car').hide();
    });

    setupView.setSavedState();

  });
  module.setupView = setupView;
})(app);
