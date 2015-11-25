function changeToArray(obj){
  var array = [];

  if (obj){
    for(var propt in obj){
      array.push(obj[propt]);
    }
  }

  return array;
}

function search(array, element){
  for (var i = 0; i < array.length; i++){
    if (array[i] === element){
      return array[i];
    }
  }

  return null;
}

function  userDontHaveOpinion(mark, userId){
  console.log('mark.confirms', mark.confirms);
  console.log('mark.complaints', mark.complaints);
  console.log('userId', userId);

  var found = search(mark.confirms, userId);

  if (!found){
    found = search(mark.complaints, userId);
  }

  console.log('found', found);
  return !found;
}

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

    this.$$('smart-map').addEventListener('country-changed', this.loadMarks.bind(this));
    this.$$('smart-map').addEventListener('publish', this.publish.bind(this));
    this.$$('smart-map').addEventListener('confirm', function(data){
      self.addOpinion('confirms', data);
    });

    this.$$('smart-map').addEventListener('complaint', function(data){
      self.addOpinion('complaints', data);
    });


    this.$$('freewater-users').addEventListener('users-ready', function(){
      self.usersReady = true;
    });
  },
  addOpinion: function (typeOpinion, data) {
    var message = 'Yo have to login to confirm or deny a water point';

    this.checkLogin(message).then(function(user){
        var mark = data.detail.mark;

        if (userDontHaveOpinion(mark, user.id)){
          var marksdataSource = new Firebase('https://blinding-fire-1061.firebaseIO.com/marks/' +
            mark.__firebaseKey__);
          var array = marksdataSource.child(typeOpinion);

          if (!array){
            array = [];
          }

          array.push(user.id);
          var objectToUpdate = {};
          objectToUpdate[typeOpinion] = array;
          marksdataSource.update( objectToUpdate );
        }
      });
  },
  loadMarks: function(customEvent){

    var country = customEvent.detail.country;
    console.log('country', country);
    var self = this;

    this.marksdataSource.orderByChild('country').equalTo(country).on('value', function(snapshot) {
      self.marks = snapshot.val();

        if (self.$$('.progress-panel').style.display === 'block'){
          self.hideProgressbar();
        }

      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code);
      });
  },
  hideProgressbar: function(){
    this.$$('.progress-panel').style.display = 'none';
    this.$$('.progress-panel').style.height = '500px';
    this.$$('smart-map').style.height = '500px';
  },
  loadMarksToMap: function(){
    var firebaseLogin  = this.$$('firebase-login');
    var loginUser = firebaseLogin.user;

    var users = this.$$('freewater-users');
    var marksWithUsers = [];

    for(var propt in this.marks){
        var mark = this.marks[propt];
        mark.__firebaseKey__ = propt;

        mark.createdDate = moment(mark.createdDate)
          .format('MMMM Do YYYY, h:mm:ss a');
        mark.confirms = changeToArray(mark.confirms);
        mark.complaints = changeToArray(mark.complaints);

        var user = users.getUser( mark.user );
        mark.user = user;

        if (loginUser){
          mark.gaveOpinion = !userDontHaveOpinion(mark, loginUser.id);
        }

        console.log('mark.gaveOpinion', mark.gaveOpinion);
        marksWithUsers.push( this.marks[propt] );

    }

    this.$$('smart-map').marks = marksWithUsers;
  },
  publish: function (data) {
    var self = this;
    var message = 'Yo have to login to publish a water point';

    this.checkLogin(message).then(function(user){
        self.publishByLoggedUser(data, user);
      });
  },
  checkLogin: function (message) {
    var self = this;

    return new Promise(function(resolve){
        var firebaseLogin  = self.$$('firebase-login');
        firebaseLogin.message = message;
        var loginUser = firebaseLogin.user;

        if (!loginUser) {
          firebaseLogin.showLoginDialog().
            then(function(user){
                console.log('User', user);
                resolve(user);
              },
              function(error){
                console.error('login failed', error);
              }
            );
        }else{
          resolve(loginUser);
        }
    });
  },
  publishByLoggedUser: function(data, user){
    var mark;
    console.log('data.detail', data.detail);

    if (data.detail){
      mark = data.detail;
    }else{
      mark = data;
    }

    mark.user = user.id;
    this.marksdataSource.push(mark);
    this.$$('smart-map').successRegisterMessage = 'Publish successfully';
  }
});
