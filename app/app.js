const express = require('express');
const app = express();
const reload = require('reload');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const dataFile = require('./data/data.json');
const poll = require('./getPoll');
const login = require('./routes/login');
const auth = require('./lib/auth');

const configDB = require('./lib/database');
mongoose.connect(configDB.url);

require('./lib/passport')(passport);

app.set('port', process.env.PORT || 3000 );
app.set('appData', dataFile);
app.set('view engine', 'ejs');
app.set('views', 'app/views');
app.set('Poll', poll)

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/newPoll'));
//app.use(require('./routes/login'));

// required for passport
app.use(session({ secret: 'stop!youshouldnotreadthisbecauseisasecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var server = app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'));
});

reload(server, app);
