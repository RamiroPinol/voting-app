var express = require('express');
var reload = require('reload');

var app = express();
var dataFile = require('./data/data.json');
var Pool = require('./public/js/getPool');

app.set('port', process.env.PORT || 3000 );
app.set('appData', dataFile);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.use(express.static('app/public'));

app.get('/', (req, res) => {
  let data = req.app.get('appData')

  const newPool = new Pool()
  const pool = newPool.getPool(data, 123, 2)
  const options = newPool.getOptions(pool[2])

  res.render("index", {
    userName: pool[0].userName,
    poolName: pool[1].poolName,
    options: options
  })
})

var server = app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'));
});

reload(server, app);

//<script src="/reload/reload.js"></script>
