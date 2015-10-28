function getDistance(pos1, pos2){
    var R = 6372.795477598;
    var C = Math.PI/180
    var lata = pos1.lat;
    var lona = pos1.lng;;

    var latb = pos2.lat;
    var lonb = pos2.lng;

    var distance = 2 * R * Math.asin(
      Math.sqrt( Math.pow ( Math.sin(C * ( lata - latb ) / 2), 2)
        + Math.cos( C * lata ) * Math.cos(C * latb)
        * Math.pow (Math.sin(C * ( lonb - lona) / 2 ), 2))
    );

    return Math.floor(distance * 100) / 100;
}

Polymer({
  is: 'smart-map',
  listeners: {
    'tap': 'tap'
  },
  properties:{
    marks: Array,
    pos: Object,
    direction: Object
  },
  observers: [
    'changeMark(marks, pos)'
  ],
  ready: function(){
    this.fire('map-ready');
    this.loadCurrentPos();
  },
  changeMark: function(marks, pos){

    if (this.marks && this.marks.length > 0 && this.pos){
      var that = this;
      this.sorted = [];

      for (var i = 0; i < this.marks.length; i++){
        var mark = this.marks[i];
        mark.distance = getDistance(this.pos, mark);
        var distanceElement = that.$$('#' + mark.__firebaseKey__ + ' .distance');
        distanceElement.textContent = mark.distance + ' KM';
        this.sorted.push(mark);
      }

      this.sorted.sort((a, b) => a.distance - b.distance);

      this.closer = this.sorted[0].distance < 20;
      this.veryCloser = this.sorted[0].distance < 0.5;
    }
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

    if (!this.googleMap){
      this.initMap(location);
    }

    this.currentPosMarker = document.querySelector('google-map .currentPos');
    this.currentPosMarker.latitude = this.pos.lat;
    this.currentPosMarker.longitude = this.pos.lng;
  },
  initMap: function(location) {

    this.googleMap = document.querySelector('google-map');
    this.googleMap.zoom = 17;
    this.googleMap.latitude = this.pos.lat;
    this.googleMap.longitude = this.pos.lng;
    this.loadCurrentPos();
  },
  tap: function(e){
    console.log('e.target.alt', e.target.alt);

    if (e.target.alt === 'Publish'){
      this.name = this.querySelector('#mark_name').value;
      this.fire('publish', {lat: this.pos.lat,
        lng: this.pos.lng,
        name: this.name,
        confim: 0,
        complaint: 0});
    }else if (e.target.alt === 'confirm'){
      this.fire('confirm', { mark: this.marks[ this.getIndex(e.target) ] });
      this.addOpinion(e.target);
    }else if (e.target.alt === 'complaint'){
      this.fire('complaint', { mark: this.marks[ this.getIndex(e.target) ] });
      this.addOpinion(e.target);
    }else if(e.target.alt === 'directions'){
      this.markDirectionTo(this.marks[ this.getIndex(e.target) ]);
    }else if (e.target.alt === 'search closer'){
      this.markDirectionTo(this.sorted[ 0 ]);
    }else{
      this.$$('google-map-directions').map = null;
      this.direction = undefined;
    }
  },
  markDirectionTo: function(mark){
    var start = `${this.pos.lat}, ${this.pos.lng}`;
    var end = `${mark.lat}, ${mark.lng}`;

    this.direction = {start: start, end: end};
  },
  addOpinion: function(target){
    var parent = target.parentElement.parentElement;
    var label = parent.querySelector('.' + target.alt + 'Label');
    label.textContent = parseInt(label.textContent) + 1;
  },
  getIndex: function(target){
    var parent = target.parentElement.parentElement;
    var hiddenElement = parent.querySelector('input[type="hidden"]');
    return hiddenElement.value;
  }
});
