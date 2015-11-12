Polymer({
  is: 'free-water-map',
  ready: function(){
    console.log('free-water-map');

    this.marksdataSource = new Firebase('https://blinding-fire-1061.firebaseIO.com/marks');

    this.loadMarks();

    this.$$('smart-map').addEventListener('publish', this.publish.bind(this));

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
  loadMarks: function(){
    var self = this;

    this.marksdataSource.on('value', function(snapshot) {

      var marks = [];
      var obj = snapshot.val();

      for(var propt in obj){
          var mark = obj[propt];
          mark.__firebaseKey__ = propt;
          marks.push(obj[propt]);
      }

      self.$$('smart-map').marks = marks;
    }, function (errorObject) {
      console.log('The read failed: ' + errorObject.code);
    });
  },
  publish: function (data) {
      var firebaseLogin  = this.$$('firebase-login');
      var loginUser = firebaseLogin.user;

      if (!loginUser) {
          firebaseLogin.login();
      }else{
        this.marksdataSource.push(data.detail);
        this.$$('smart-map').successRegisterMessage = 'Publish successfully';
      }
  }
});
