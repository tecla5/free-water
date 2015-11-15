Polymer({
  is: 'freewater-users',
  ready: function(){
    var usersDataSource = new Firebase('https://blinding-fire-1061.firebaseIO.com/users');
    var self = this;

    usersDataSource.on('value', function(dataSnapshot) {
      console.log('USERS LOADED');
      self.users = dataSnapshot.val();
      self.fire('users-ready');
    });
  },
  getUser: function(userId){
    if (this.users){
      return this.users[userId];
    }

    return null;
  }
});
