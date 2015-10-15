var express = require("express");
var middlewares = require('./middlewares');

var app = express();

app.use('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

middlewares(app);

var port = process.env.port | 3000;

var server = app.listen(port, function () {

  var host = server.address().address;

  console.log('listening at http://%s:%s', host, port);

});
