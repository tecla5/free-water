Polymer({
  is: 'firebase-login',
  properties:{
    user: Object,
    message: String
  },
  listeners: {
    'googleLogin.tap': 'googleLogin',
    'facebookLogin.tap': 'facebookLogin'
  },
  ready: function(){
    this.ref = new Firebase('https://blinding-fire-1061.firebaseIO.com');
    var self = this;

    this.ref.onAuth(function(authData){
        self.setUserProperty(authData);
    });
  },
  attached: function(){
    this.showUserLoggedInfo();
  },
  showLoginDialog: function(){
    var self = this;

    return new Promise(function(resolve, reject){
      self.$.loginDialog.open();
      self.promiseOpts = {
        resolve:  resolve,
        reject: reject
      };
    });
  },
  login: function(platform){
    var self = this;
    this.ref.authWithOAuthPopup(platform, function(error, authData) {
      if (error) {
        console.log('Login Failed!', error);
        self.promiseOpts.reject(error);
      } else {
        console.log('Authenticated successfully with payload:', authData);
        self.setUserProperty(authData);
        self.promiseOpts.resolve(self.user);
      }

      self.closeLoginDialog();
    });
  },
  showUserLoggedInfo: function(){
    var userNameComponent = document.querySelector('.user-name');

    if (userNameComponent && this.user){
      document.querySelector('.user-name').innerHTML = this.user.displayName;
      document.querySelector('.user-picture').src = this.user.picture;
    }
  },
  setUserProperty: function(authData){

    if (authData){
      this.user = {};
      console.log('authData', JSON.stringify(authData));
      if (authData.google){
        this.user.displayName = authData.google.displayName;
        this.user.picture = authData.google.profileImageURL;
        this.user.id = authData.uid;
      }else{
         this.user.displayName = authData.facebook.displayName;
         this.user.picture = authData.facebook.profileImageURL;
         this.user.id = authData.uid;
         
      }
      console.log(JSON.stringify(authData));

      this.getUpdateUserFirebase();
      this.showUserLoggedInfo();
    }else{
      this.user = authData;
    }
  },
  getUpdateUserFirebase : function(){
    var ref = new Firebase('https://blinding-fire-1061.firebaseio.com/users/' + this.user.id);
    ref.set(this.user);
  },
  googleLogin: function(){
    this.login('google');
  },
  facebookLogin: function(){
    this.login('facebook');
  },
  closeLoginDialog: function(){
    //TODO: add code to close login dialog
    this.promiseOpts = {};
  }

});
