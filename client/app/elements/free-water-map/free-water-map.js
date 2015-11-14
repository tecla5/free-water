Polymer({
  is: 'free-water-map',
  properties:{
    usersReady: Boolean,
    marks: Array
  },
  observers: [
    'loadMarksToMap(marks, usersReady)'
  ],
  ready: function(){
    console.log('free-water-map');
    var self =  this;

    this.marksdataSource = new Firebase('https://blinding-fire-1061.firebaseIO.com/marks');

    this.loadMarks();

    this.$$('smart-map').addEventListener('publish', this.publish.bind(this));

    this.$$('smart-map').addEventListener('confirm', this.confirm.bind(this));

    this.$$('smart-map').addEventListener('complaint', function (data) {
      var mark = data.detail.mark;

      var marksdataSource = new Firebase('https://blinding-fire-1061.firebaseIO.com/marks/' + mark.__firebaseKey__);
      marksdataSource.update({complaint: mark.complaint + 1});
    });

    this.$$('freewater-users').addEventListener('users-ready', function(){
      self.usersReady = true;
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
    marksdataSource.update( { confirms: confirms } );
  },
  loadMarks: function(){
    var self = this;

    this.marksdataSource.on('value', function(snapshot) {
      self.marks = snapshot.val();
    }, function (errorObject) {
      console.log('The read failed: ' + errorObject.code);
    });
  },
  loadMarksToMap: function(){
    var users = this.$$('freewater-users');
    var marksWithUsers = [];

    for(var propt in this.marks){
        var mark = this.marks[propt];
        mark.__firebaseKey__ = propt;

        mark.createdDate = moment(mark.createdDate)
          .format('MMMM Do YYYY, h:mm:ss a');
          
        console.log('mark.user', mark.user);
        var user = users.getUser( mark.user );
        mark.user = user;

        marksWithUsers.push( this.marks[propt] );
    }

    this.$$('smart-map').marks = marksWithUsers;
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
