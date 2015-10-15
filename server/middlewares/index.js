var json_server_middlewares = require('./json-server-middleware');

var middlewares = [json_server_middlewares];

module.exports = function(server){
  for (var i = 0; i < middlewares.length; i++){
    middlewares[i](server);
  }
};
