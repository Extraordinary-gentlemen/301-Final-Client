let __API_URL__ = 'https://extraordinary-gentlemen.herokuapp.com';
if(location.hostname !== 'pumpfinder.herokuapp.com') __API_URL__ = 'http://localhost:4000';

// Google Maps
let renderMap = (zoom) => {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // console.log(pos);
      let map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: zoom,
        mapTypeId: 'roadmap',
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
        }
      })

      $.get(`/api/v1/markers/${pos.lat},${pos.lng}`)
        .then(results => {

          results.forEach((location) => {
            var marker = new google.maps.Marker({
              position: location.coords,
              map: map
            })
          });
        })
    }, function() {
    });
  } else {
    handleLocationError(false, map.getCenter());
  }

  // google.maps.event.addDomListener(window, 'resize', () => {
  //   var center = map.getCenter();
  //   google.maps.even.trigger(map, 'resize');
  //   map.setCenter(center)
  // })


  // $.get('https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap')

}
