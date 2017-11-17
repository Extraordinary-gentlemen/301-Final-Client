'use strict';

var app = app || {};

(function(module){
  // Set the __API_URL__ for requests to the server
  let __API_URL__ = 'https://extraordinary-gentlemen.herokuapp.com';
  if(location.hostname !== 'pumpfinder.herokuapp.com') __API_URL__ = 'http://localhost:4000';

  module.queryApi = (lat,lng) => {
    $.get(`${__API_URL__}/api/v1/markers/${lat},${lng}`)
      .then(results => {
        module.allStores = results;
        module.populateStoresList();
        module.renderMap(lat,lng);
        module.addMarkers(lat, lng);
        page('/results');
      }, console.error);
  };

  module.populateStoresList = () => {
    // Get gallons and average mpg from data retrieved earlier.
    let gallonsBuying = module.setup.myCar.gal;
    let mpg = module.setup.myCar.mpg;

    // for every store, calcukate used fuel, travel cost, buying cost, and total which is buying cost + travel cost.
    module.allStores.forEach(storeArray => {
      storeArray.usedFuel = storeArray.distance / mpg;
      storeArray.travelcost = storeArray.fuelCost * storeArray.usedFuel;
      storeArray.buyingCost = storeArray.fuelCost * gallonsBuying;
      storeArray.totalCost = storeArray.buyingCost + storeArray.travelcost;
    });

    module.allStores.sort((one,theOther) => one.totalCost - theOther.totalCost);

    // this takes the first 5 indexes which should be the 5 smallest total costs.
    module.topStores = module.allStores.slice(0,5);

    // for each of the top stores, we build an object with keys matching the handlebar placeholders in the template.
    // then append them to #store-list.
    module.topStores.forEach(storeArray => {
      let format = Handlebars.compile($('#store-display-template').text());
      let data = {
        preTravelCost: storeArray.buyingCost.toFixed(2),
        postTravelCost: storeArray.totalCost.toFixed(2),
        travelTime: storeArray.duration,
        stationDisplay: `${storeArray.name} - ${storeArray.address}`
      };
      $('#store-list').append(format(data));
    });
  }

  module.renderMap = (lat,lng) => {
    //build map object out of google's crazy code
    module.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: lat, lng: lng},
      zoom: 12,
      mapTypeId: 'roadmap',
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER
      },
      styles: mapStyle
    });
  };

  module.closeInfoWindows = infoWindows => {
    infoWindows.forEach(infoWindow => {
      infoWindow.close();
    });
  };

  module.addMarkers = (lat, lng) => {
    var windowContent = `You are here!`;
    var infowindow = new window.google.maps.InfoWindow({
      content: windowContent
    });

    module.infoWindows = [infowindow];

    var marker = new window.google.maps.Marker({
      position: {lat: lat, lng: lng},
      map: module.map,
      icon: '../../img/me.png'
    });

    marker.addListener('click', function() {
      module.closeInfoWindows(module.infoWindows);
      infowindow.open(module.map, marker);
    });

    module.allStores.forEach((store) => {
      var windowContent = `<p>${store.name}</p><br><span>distance: ${store.distance} miles<br>duration: ${store.duration}<br>price (regular): $${store.fuelCost}<br>travel cost: $${store.travelcost.toFixed(2)}<span>`;

      var infowindow = new window.google.maps.InfoWindow({
        content: windowContent
      });

      module.infoWindows.push(infowindow);
      var marker = new window.google.maps.Marker({
        position: store.coords,
        map: module.map,
        icon: '../../img/logo.png'
      });

      marker.addListener('click', function() {
        module.closeInfoWindows(module.infoWindows);
        infowindow.open(module.map, marker);
      });
    });
  };

  const mapStyle = [
    {
      elementType: 'geometry',
      stylers: [{color: '#f5f5f5'}]
    },
    {
      elementType: 'labels.icon',
      stylers: [{visibility: 'off'}]
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{color: '#616161'}]
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{color: '#f5f5f5'}]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [{color: '#bdbdbd'}]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{color: '#eeeeee'}]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#757575'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{color: '#e5e5e5'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9e9e9e'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#D13A23'}]
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.text.fill',
      stylers: [{color: '#757575'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {color: '#880000'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {color: '#616161'}]
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        {color: '#9e9e9e'}]
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [
        {color: '#e5e5e5'}]
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [
        {color: '#eeeeee'}]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#AAC0C8'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9e9e9e'}]
    }
  ];

})(app);
