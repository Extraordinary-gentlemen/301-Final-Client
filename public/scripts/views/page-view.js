'use strict';

var app = app || {};

(function (module){
  const pageView = {};
  pageView.initMapView = function(){
    let $result = $('#result-display');
    $('.container').hide();
    $result.removeClass('hide');
    $result.show();
    window.google.maps.event.trigger(app.map, 'resize');
    app.map.setCenter({lat: app.lat, lng: app.lng});
  };

  pageView.initSetupView = function(){
    let $setup = $('#vehicle-setup');
    $('.container').hide();
    $setup.removeClass('hide');
    $setup.show();
  };

  pageView.initAboutView = function(){
    let $about = $('#about-us');
    $('.container').hide();
    $about.removeClass('hide');
    $about.show();
  };

  $(() => {
    $('.back').on('click', () => {
      page('/');
    });
  });

  module.pageView = pageView;
})(app)
