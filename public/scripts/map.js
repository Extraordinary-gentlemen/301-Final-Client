// Google Maps

let renderMap = (lat,lng, zoom) => {
  let map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat, lng: lng},
    zoom: zoom,
    mapTypeId: 'roadmap',
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    }
  })

  // google.maps.event.addDomListener(window, 'resize', () => {
  //   var center = map.getCenter();
  //   google.maps.even.trigger(map, 'resize');
  //   map.setCenter(center)
  // })

  $.get(`/api/v1/${lat}${lng}`
    .then(results => {
      results.forEach((coordpair) => {
        new google.maps.Marker({
          postion: coordpair,
          map: map
        })
      });
    })
    .err(err => console.log()`Error Code Mundy 1: ${err}`)
};
