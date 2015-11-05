Polymer({
  is: 'free-water-map',
  ready: function(){
    var smartMap = this.$$('smart-map');
    var marksdataSource = new Firebase('https://blinding-fire-1061.firebaseIO.com/marks');

    this.loadMarks(smartMap, marksdataSource);

    this.$$('smart-map').addEventListener('publish', function (data) {
        marksdataSource.push(data.detail);
        smartMap.successRegisterMessage = 'Publish successfully';
    });

    this.$$('smart-map').addEventListener('confirm', function (data) {
      var mark = data.detail.mark;

      var marksdataSource = new Firebase('https://blinding-fire-1061.firebaseIO.com/marks/' + mark.__firebaseKey__);
      marksdataSource.update({confirm: mark.confirm + 1});
    });

    this.$$('smart-map').addEventListener('complaint', function (data) {
      var mark = data.detail.mark;

      var marksdataSource = new Firebase('https://blinding-fire-1061.firebaseIO.com/marks/' + mark.__firebaseKey__);
      marksdataSource.update({complaint: mark.complaint + 1});
    });
  },
  loadMarks: function(smartMap, marksdataSource){
    marksdataSource.on('value', function(snapshot) {
      var marks = [];
      var obj = snapshot.val();

      for(var propt in obj){
          marks.push(obj[propt]);
      }

      smartMap.marks = marks;
    }, function (errorObject) {
      console.log('The read failed: ' + errorObject.code);
    });
  }
});
