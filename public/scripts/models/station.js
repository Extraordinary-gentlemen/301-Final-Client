'use strict';

var app = app || {};

(function(module) {
  let __API_URL__ = process.env.__API_URL__; // eslint-disable-line
  // 'https://extraordinary-gentlemen.herokuapp.com/';

  module.getMakes = year => { // eslint-disable-line
    $.get('http://www.fueleconomy.gov/ws/rest/vehicle/menu/year')
      .then(results => {
      module.xmlData = module.xmlToJson(results).menuItems.menuItem.map(obj => obj.text['#text']); // eslint-disable-line
      }, console.error);
  };

  // module.test = (ctx, next) => {
  //   $.get(`${module.__API_URL__}/api/v1/books`)
  //     .then(Book.loadAll)
  //     .then(next)
  //     .catch(errorCallback);
  // };

})(app);
