var express = require('express');
var router = express.Router();

router.get('/user', function(req, res) { //lo de ID seguro esta mal

  res.render('user', {
    // Agregar variables necesarias
  });

});

module.exports = router;
