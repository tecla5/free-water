module.exports = function(server){

  var jsonServer = require('json-server');

  server.use(jsonServer.defaults());

  var router = jsonServer.router('db.json');
  server.use(router);
}
