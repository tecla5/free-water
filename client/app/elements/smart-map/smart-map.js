function getDistance(pos1, pos2){
    var R = 6372.795477598;
    var C = Math.PI/180;
    var lata = pos1.lat;
    var lona = pos1.lng;

    var latb = pos2.lat;
    var lonb = pos2.lng;

    var distance = 2 * R * Math.asin(
      Math.sqrt( Math.pow ( Math.sin(C * ( lata - latb ) / 2), 2) +
        Math.cos( C * lata ) * Math.cos(C * latb) *
        Math.pow (Math.sin(C * ( lonb - lona) / 2 ), 2))
    );

    return Math.floor(distance * 100) / 100;
}

function getReliability(mark){
  if ((mark.confirm + mark.complaint) === 0) {return '../../images/new_water_icon.png';}

  var reliability =  (mark.confirm * 100)/ (mark.confirm + mark.complaint);

  if (reliability >= 75) {return '../../images/water_icon_100.png';}
  else if (reliability < 75 && reliability >= 50) {return '../../images/water_icon_75.png';}
  else if (reliability < 50 && reliability >= 30) {return '../../images/water_icon_50.png';}
  else {return '../../images/water_icon_20.png';}
}


Polymer({
  is: 'smart-map',
  listeners: {
    'tap': 'tap'
  },
  properties:{
    marks: Array,
    pos: Object,
    direction: Object,
    searchResults: Array
  },
  observers: [
    'changeMark(marks, pos)',
    'currentPosChanged(searchResults)'
  ],
  ready: function(){
    this.fire('map-ready');
    this.loadCurrentPos();
  },
  currentPosChanged: function(searchResults){
    console.log('searchResults', JSON.stringify(searchResults));

    if (searchResults.length > 0){
      this.pos.name = searchResults[0].name;
      this.pos.formattedAddress = searchResults[0].formatted_address;
    }
  },
  changeMark: function(marks, pos){
    this.marks = marks;
    this.pos =pos;

    if (this.marks && this.marks.length > 0 && this.pos){
      this.sorted = [];

      for (var i = 0; i < this.marks.length; i++){
        var mark = this.marks[i];
        mark.distance = getDistance(this.pos, mark);
        mark.icon = getReliability(mark);

        this.sorted.push(mark);
      }

      this.sorted.sort( function (a, b) { return a.distance - b.distance; });

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

    var googleSearch = this.$$('google-map-search');
    googleSearch.query = this.pos.lat + ',' + this.pos.lng;
    googleSearch.search();
  },
  initMap: function(location) {
    console.log(location);
    this.googleMap = document.querySelector('google-map');
    this.googleMap.zoom = 17;
    this.googleMap.latitude = this.pos.lat;
    this.googleMap.longitude = this.pos.lng;
    this.loadCurrentPos();
  },
  tap: function(e){
    console.log('e.target.alt', e.target.alt);

    if (e.target.alt === 'Publish'){

      this.fire('publish', {lat: this.pos.lat,
        lng: this.pos.lng,
        name: this.pos.name,
        formattedAddress: this.pos.formattedAddress,
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
    var start = this.pos.lat + ', '+ this.pos.lng;//`${this.pos.lat}, ${this.pos.lng}`;
    var end = mark.lat + ', '+ mark.lng;//`${mark.lat}, ${mark.lng}`;

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
