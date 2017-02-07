var express = require('express');
var reload = require('reload');

var app = express();
var dataFile = require('./data/data.json');
var poll = require('./getPoll');

app.set('port', process.env.PORT || 3000 );
app.set('appData', dataFile);
app.set('view engine', 'ejs');
app.set('views', 'app/views');
app.set('Poll', poll)

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/newPoll'));
app.use(require('./routes/user'));


var server = app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'));
});

reload(server, app);

//<script src="/reload/reload.js"></script>
