var express = require('express');
var reload = require('C:/Users/Ramiro/AppData/Roaming/npm/node_modules/reload');
var app = express();
var dataFile = require('./data/data.json');

app.set('port', process.env.PORT || 3000 );

app.get('/', function (req, res) {
  res.send(JSON.stringify(dataFile.users[1].user_name))
})

var server = app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'));
});

reload(server, app);
