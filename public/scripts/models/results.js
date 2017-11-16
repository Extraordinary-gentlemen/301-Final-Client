// Google Maps
var app = app || {};

let debug = true;

(function(module){
  // Set the __API_URL__ for requests to the server
  let __API_URL__ = 'https://extraordinary-gentlemen.herokuapp.com';
  if(location.hostname !== 'pumpfinder.herokuapp.com') __API_URL__ = 'http://localhost:4000';

  module.queryApi = (lat,lng) => {
    if(debug) console.log('API Query Starting');
    $.get(`${__API_URL__}/api/v1/markers/${lat},${lng}`)
      .then(results => {
        // if(debug) console.log(results);
        module.allStores = results;
        if(debug) console.log('Populating Stores List');
        module.populateStoresList();
        if(debug) console.log('Creating Google Map');
        module.renderMap(lat,lng);
        if(debug) console.log('Adding Markers');
        module.addMarkers();
      }
        ,
      err => {
        console.log('Error requesting information from server: ' + err);
      });
  }

  module.populateStoresList = () => {
    if(debug) console.log('  Getting data from app.setup.myCar');
    // Get gallons and average mpg from data retrieved earlier.
    let gallonsBuying = module.setup.myCar.gal;
    let mpg = module.setup.myCar.mpg;

    if(debug) console.log('  Calculating mathy stuffs');
    // for every store, calcukate used fuel, travel cost, buying cost, and total which is buying cost + travel cost.
    module.allStores.forEach(storeArray => {
      storeArray.usedFuel = storeArray.distance / mpg;
      storeArray.travelcost = storeArray.fuelCost * storeArray.usedFuel;
      storeArray.buyingCost = storeArray.fuelCost * gallonsBuying;
      storeArray.totalCost = storeArray.buyingCost + storeArray.travelcost;
    })

    module.allStores.sort((one,theOther) => one.totalCost - theOther.totalCost)

    // if(debug) console.log('  Shortening store list to just five entries');
    // this takes the first 5 indexes which should be the 5 smallest total costs.
    module.topStores = module.allStores.slice(0,5)

    // for each of the top stores, we build an object with keys matching the handlebar placeholders in the template.
    // then append them to #store-list.
    module.topStores.forEach(storeArray => {
      let format = Handlebars.compile($('#store-display-template').text());
      // let buyingCost = Math.floor(storeArray.buyingCost * 100) / 100
      let data = {
        preTravelCost: storeArray.buyingCost.toFixed(2),
        postTravelCost: storeArray.totalCost.toFixed(2),
        travelTime: storeArray.duration,
        stationDisplay: `${storeArray.name} - ${storeArray.address}`
      }
      $('#store-list').append(format(data))
    });

  }

  module.renderMap = (lat,lng) => {

    if(debug) console.log('  Creating map using google mystery code');
    //build map object out of google's crazy code
    module.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: lat, lng: lng},
      //TODO: zoom level should be dynamic and returned by API
      zoom: 12,
      mapTypeId: 'roadmap',
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER
      }
    });
  }

  module.addMarkers = () => {
    if(debug) console.log('  For each store, add a marker to the map.');
    module.allStores.forEach((store) => {
      var windowContent = `<p>${store.name}</p><br><span>distance: ${store.distance} miles<br>duration: ${store.duration}<br>price (regular): $${store.fuelCost}<br>travel cost: $${store.travelcost.toFixed(2)}<span>`;

      var infowindow = new window.google.maps.InfoWindow({
        content: windowContent
      });

      var marker = new window.google.maps.Marker({
        position: store.coords,
        map: module.map
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
    });
  }
})(app);
