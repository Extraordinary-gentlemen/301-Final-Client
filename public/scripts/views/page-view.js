'use strict';

var app = app || {};

(function (module){
  const pageView = {};
  pageView.initMapView = function(ctx){
    let $result = $('#result-display');
    $('.container').hide();
    $result.removeClass('hide');
    $result.show();
  };
  pageView.initSetupView = function(ctx){
    let $setup = $('#vehicle-setup');
    $('.container').hide();
    $setup.removeClass('hide');
    $setup.show();
  };
  pageView.initAboutView = function(ctx){
    let $about = $('#about-us');
    $('.container').hide();
    $about.removeClass('hide');
    $about.show();
  };
  module.pageView = pageView;
})(app)
