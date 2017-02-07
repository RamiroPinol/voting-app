var express = require('express');
var router = express.Router();

//var Pool = require('./public/js/getPool');

router.get('/', (req, res) => {
  let data = req.app.get('appData')
  const Poll = req.app.get('Poll')

  const newPoll = new Poll()
  const poll = newPoll.getPoll(data, 123, 2)
  const options = newPoll.getOptions(poll[2])

  res.render("index", {
    userName: poll[0].userName,
    poolName: poll[1].poolName,
    options: options
  })
})

module.exports = router;
