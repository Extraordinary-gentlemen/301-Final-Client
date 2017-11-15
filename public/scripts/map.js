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

  $.get(`https://extraordinary-gentlemen.herokuapp.com/api/v1/markers/${lat},${lng}`)
    .then(results => {
      // console.log(results);
      results.forEach((location) => {
        var marker = new google.maps.Marker({
          position: location.coords,
          map: map
        })
      });
    })
  // $.get('https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap')

}
