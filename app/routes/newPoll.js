var express = require('express');
var router = express.Router();

router.get('/newpoll', function(req, res) {

  res.render('newpoll', {
    // Agregar variables necesarias
  });

});

module.exports = router;
