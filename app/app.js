var express = require('express');
var reload = require('reload');
var app = express();
var dataFile = require('./data/data.json');

app.set('port', process.env.PORT || 3000 );
app.set('appData', dataFile);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.get('/', (req, res) => {
  let data = req.app.get('appData')

  // test con wense (users[0])
  const wense = data.users[1]
  const firstPool = wense.pools[0]

  const userName = wense.user_name
  const poolName = firstPool.pool_name
  const opt1 = firstPool.options.opt1
  const opt2 = firstPool.options.opt2

  res.render("index", {
    userName: userName,
    poolName: poolName,
    opt1: opt1,
    opt2: opt2
  })
})

var server = app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'));
});

reload(server, app);

//<script src="/reload/reload.js"></script>
