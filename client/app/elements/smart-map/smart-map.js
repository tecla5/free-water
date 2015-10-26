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
        return navigator.geolocation.getCurrentPosition(this.initMap.bind(this));
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
  },
  publish: function(e){
    var index;
    console.log('e.target.alt', e.target.alt);
    if (e.target.alt === 'Publish'){
      this.name = this.querySelector('#mark_name').value;
      this.fire('publish', {lat: this.pos.lat,
        lng: this.pos.lng,
        name: this.name,
        confim: 0,
        complaint: 0});
    }else if (e.target.id.startsWith('confirmButton')){
      console.log('CONFIM');
      index = e.target.id.split('-')[1];
      this.fire('confirm', { mark: this.marks[index] });
    }else if (e.target.id.startsWith('complaintButton')){
      console.log('complaint');
      index = e.target.id.split('-')[1];
      this.fire('complaint', { mark: this.marks[index] });
    }
  }
});
