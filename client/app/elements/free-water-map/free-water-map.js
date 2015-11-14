Polymer({
  is: 'free-water-map',
  ready: function(){
    console.log('free-water-map');

    this.marksdataSource = new Firebase('https://blinding-fire-1061.firebaseIO.com/marks');

    this.loadMarks();

    this.$$('smart-map').addEventListener('publish', this.publish.bind(this));

    this.$$('smart-map').addEventListener('confirm', this.confirm.bind(this));

    this.$$('smart-map').addEventListener('complaint', function (data) {
      var mark = data.detail.mark;

      var marksdataSource = new Firebase('https://blinding-fire-1061.firebaseIO.com/marks/' + mark.__firebaseKey__);
      marksdataSource.update({complaint: mark.complaint + 1});
    });
  },
  confirm: function (data) {
    var mark = data.detail.mark;
    var marksdataSource = new Firebase('https://blinding-fire-1061.firebaseIO.com/marks/' +
      mark.__firebaseKey__);
    var confirms = marksdataSource.child('confirms');

    if (!confirms){
      confirms = [];
    }

    confirms.push(this.user.id);
    marksdataSource.update({confirms: confirms});
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
        var self = this;

        firebaseLogin.showLoginDialog().
          then(function(user){
              console.log('User', user);
              self.publishByLoggedUser(data, user);
            },
            function(error){
              console.error('login failed', error);
            }
          );
      }else{
        this.publishByLoggedUser(data, loginUser);
      }
  },
  publishByLoggedUser: function(data, user){
    data.detail.user = user.id;
    this.marksdataSource.push(data.detail);
    this.$$('smart-map').successRegisterMessage = 'Publish successfully';
  }
});
