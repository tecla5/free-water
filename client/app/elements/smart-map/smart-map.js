Polymer({
  is: 'smart-map',
  listeners: {
    'tap': 'publish'
  },
  properties:{
    marks: Array
  },
  ready: function(){
    this.fire('map-ready');
    this.loadCurrentPos();
  },
  loadCurrentPos: function(){
    if (navigator.geolocation) {
        setTimeout(this.loadCurrentPos.bind(this), 5000);
        return navigator.geolocation.getCurrentPosition(
          this.updateCurrentPosMarker.bind(this));
    } else {
        throw  'Geolocation is not supported.';
    }
  },
  updateCurrentPosMarker: function(location){
    this.pos = {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    };

    if (!this.map){
      this.initMap(location);
    }

    this.currentPosMarker = document.querySelector('google-map .currentPos');
    this.currentPosMarker.latitude = this.pos.lat;
    this.currentPosMarker.longitude = this.pos.lng;
  },
  initMap: function(location) {

    this.map = document.querySelector('google-map');
    this.map.zoom = 15;
    this.map.latitude = this.pos.lat;
    this.map.longitude = this.pos.lng;
    this.loadCurrentPos();
  },
  publish: function(e){
    if (e.target.alt === 'Publish'){
      this.name = this.querySelector('#mark_name').value;
      this.fire('publish', {lat: this.pos.lat,
        lng: this.pos.lng,
        name: this.name,
        confim: 0,
        complaint: 0});
    }else if (e.target.alt === 'confirm'){
      this.fire('confirm', { mark: this.marks[ this.getIndex(e.target) ] });
    }else if (e.target.alt === 'complaint'){
      this.fire('complaint', { mark: this.marks[ this.getIndex(e.target) ] });
    }
  },
  getIndex: function(target){
    var parent = target.parentElement.parentElement;

    var hiddenElement = parent.querySelector('input[type="hidden"]');
    var label = parent.querySelector('.' + target.alt + 'Label');
    label.textContent = parseInt(label.textContent) + 1;
    return hiddenElement.value;
  }
});
