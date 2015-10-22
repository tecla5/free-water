var FreeWaterMapBehavior = {
  created : function() {

      if (navigator.geolocation) {
          return navigator.geolocation.getCurrentPosition(this.initMap);
      } else {
          throw  'Geolocation is not supported.';
      }
  },
  initMap: function(location) {
    this.pos = {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    };

    this.map = document.querySelector('google-map');
    this.map.latitude = this.pos.lat;
    this.map.longitude = this.pos.lng;
    this.map.zoom = 15;

    this.currentPosMarker = document.querySelector('google-map .currentPos');
    this.currentPosMarker.latitude = this.pos.lat;
    this.currentPosMarker.longitude = this.pos.lng;
  }
};

Polymer({
  is: 'free-water-map',
  behaviors: [FreeWaterMapBehavior]
});
