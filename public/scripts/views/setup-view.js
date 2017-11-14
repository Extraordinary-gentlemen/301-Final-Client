'use strict';

var app = app || {};

(function(module){ //eslint-disable-line
  // Setup Constants
  const setupView = {};
  const $yearsSelect = $('select[name="vehicle-year"]');

  setupView.loadYears = () => {
    $yearsSelect.append(`<option value="">Vehicle Year</option>`);
    for(let i = 2018; i > 1983; i--) {
      $yearsSelect.append(`<option value="${i}">${i}</option>`);
    }
  }

  $(() => {
    /* Page load initializations */
    setupView.loadYears();

    // Event Listeners
    $yearsSelect.on('change', e => {
      if(e.target.value) module.setup.getMakes(e.target.value);
    });
  });

  module.setupView = setupView;
})(app);
