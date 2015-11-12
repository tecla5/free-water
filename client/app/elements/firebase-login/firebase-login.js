Polymer({
  is: 'firebase-login',
  properties:{
    user: Object
  },
  listeners: {
    'googleLogin.tap': 'googleLogin',
    'facebookLogin.tap': 'facebookLogin'
  },
  ready: function(){
    this.ref = new Firebase('https://blinding-fire-1061.firebaseIO.com');
    var self = this;

    this.ref.onAuth(function(authData){
        self.user = authData;
    });
  },
  showLoginDialog: function(){
    var self = this;

    /*jshint camelcase: false */ /* option: add to .jshintrc file */
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
        self.promiseOpts.resolve(authData);
      }

      self.closeLoginDialog();
    });
  },
  googleLogin: function(){
    this.login('google');
  },
  facebookLogin: function(){
    this.login('facebook');
  },
  closeLoginDialog: function(){

  }

});
