var Firebase = require("firebase");

var usersRef = new Firebase("https://blinding-fire-1061.firebaseio.com/users");
var marksRef = new Firebase("https://blinding-fire-1061.firebaseio.com/marks");

usersRef.remove();
marksRef.remove();
