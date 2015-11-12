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
    this.ref = new Firebase("https://blinding-fire-1061.firebaseIO.com");
    var self = this;

    this.ref.onAuth(function(authData){
        self.user = authData;
    });
  },
  login: function(){
    this.$.loginDialog.open();
  },
  googleLogin: function(){
    this.ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  },
  facebookLogin: function(){
    this.ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  }

});
