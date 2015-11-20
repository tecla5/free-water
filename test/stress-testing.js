var usersId = {};

function getId(){
  var id;

  do {
    id = casual.integer(from = 0, to = 100000);
  } while (usersId[id]);

  usersId[id] = id;
  return id;
}

var USERS_NUMBER = 2;
var MARK_BY_USER = 5;

var Firebase = require("firebase");
var casual = require("casual");

//var usersRef = new Firebase("https://testing3.firebaseio.com/users");

for (var i = 0; i < USERS_NUMBER; i++){
  var id = getId();
  var userRef = new Firebase('https://blinding-fire-1061.firebaseio.com/users/' + id);

  userRef.set({
    displayName: casual.name,
     id: id,
     picture: casual.url
  });

  console.log('user added ', id);
}

var countries = [];
countries.push('Venezuela');
countries.push('España');
countries.push('Francia');
countries.push('Colombia');

//var marksRef = new Firebase("https://testing3.firebaseio.com/marks");
var marksRef = new Firebase("https://blinding-fire-1061.firebaseio.com/marks");
var j = 0;

for (userId in usersId){

  for (var k = 0; k < MARK_BY_USER; k++){
    var formattedAddress = casual.sentences(n = 30);

    marksRef.push({
       cretedDate: casual.unix_time,
       formattedAddress: formattedAddress,
       lat: casual.double(from = -100, to = 100),
       lng: casual.double(from = -100, to = 100),
       name: formattedAddress.substring(1, 10),
       user: userId,
       country: countries[ casual.integer(from = 0, to = 3) ]
    });

    console.log(j++);
  }
}

console.log('End');
