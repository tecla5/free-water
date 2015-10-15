
var GoogleMapBehavior = new function () {
  this.p = function() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(this.setLocation.bind(this));
    } else {
        throw  "Geolocation is not supported.";
    }
  }

  this.initMap = function(){
    alert(document.getElementById('map').textContent);
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.pos,
      zoom: 17
    });
  }

  this.setLocation = function(location){
    this.pos = {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    };

    this.initMap();
  }
}
