// Google Maps
var app = app || {};

(function(module){
  // Set the __API_URL__ for requests to the server
  let __API_URL__ = 'https://extraordinary-gentlemen.herokuapp.com';
  if(location.hostname !== 'pumpfinder.herokuapp.com') __API_URL__ = 'http://localhost:4000';

  let pos = {};

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos.lat = position.coords.latitude;
      pos.lng = position.coords.longitude;
      module.queryApi(pos.lat, pos.lng);
    });
  }

  module.queryApi = (lat,lng) => {
    $.get(`${__API_URL__}/api/v1/markers/${lat},${lng}`)
      .then(results => {
        module.allStores = results;
        module.populateStoresList();
        module.renderMap(lat,lng);
        module.addMarkers();
      });
  }

  /*    API Query returns list of 20 objects representing gas stations. Format below.
    [
      {
        coords: {lat:#,lng:#},
        address: 'string',
        name: 'string',
        fuelCost: #,
        distance: #,
        travelTime: #
      },
    ]
  */

  module.populateStoresList = () => {

    // Get gallons and average mpg from data retrieved earlier.
    let gallonsBuying = module.setup.myCar.gallons
    let mpg = module.setup.myCar.mpg.avg

    // for every store, calcukate used fuel, travel cost, buying cost, and total which is buying cost + travel cost.
    module.allStores.forEach(storeArray => {
      storeArray.usedFuel = storeArray.distance / mpg;
      storeArray.travelcost = storeArray.fuelCost * storeArray.usedFuel;
      storeArray.buyingCost = storeArray.fuelCost * gallonsBuying;
      storeArray.totalCost = storeArray.buyingCost + storeArray.travelcost;
    })

    // Sort the stores.
    // if "one" minus "theOther" is less than 0, it means that "one" is smaller than "theOther".
    // "one" sorts before "theOther".
    // if "one" minus "theOther" is greater than 0, it means that "one" is larger than "theOther".
    // "one" sorts after "theOther".
    module.allStores.sort((one,theOther) => one.totalCost - theOther.totalCost)

    // this takes the first 5 indexes which should be the 5 smallest total costs.
    module.topStores = module.allStores.slice(0,4)

    // for each of the top stores, we build an object with keys matching the handlebar placeholders in the template.
    // then append them to #store-list.
    module.topStores.forEach(storeArray => {
      let format = Handlebars.compile($('#store-display-template').text());
      let data = {
        preTravelCost: storeArray.buyingCost,
        postTravelCost: storeArray.totalCost,
        travelTime: storeArray.traveltime,
        stationDisplay: ``
      }
      $('#store-list').append(format(data))
    });

  }

  module.renderMap = (lat,lng) => {
    // let map = new google.maps.Map(document.getElementById('map'), { TODO Original code of line below

    //build map object out of google's crazy code
    module.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: lat, lng: lng},
      //TODO: zoom level should be dynamic and returned by API
      zoom: 12,
      mapTypeId: 'roadmap',
      zoomControl: true,
      zoomControlOptions: {
        // position: google.maps.ControlPosition.RIGHT_CENTER //eslint-disable-line TODO Original code of line below
        position: window.google.maps.ControlPosition.RIGHT_CENTER
      }
    });

    // google.maps.event.addDomListener(window, 'resize', () => {
    //   var center = map.getCenter();
    //   google.maps.even.trigger(map, 'resize');
    //   map.setCenter(center)
    // })
  }

  module.addMarkers = () => {
    module.allStores.forEach((store) => {
      // var marker = new google.maps.Marker({ TODO Original code of line below
      new window.google.maps.Marker({
        position: store.coords,
        map: module.map
      });
    });
  }
})(app);

// $.get('https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap')
