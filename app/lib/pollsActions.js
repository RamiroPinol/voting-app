const Poll = require('../models/pollModel');

module.exports = (req) => {

  const poll = new Poll()
  poll.userId   = req.user._id  //_id de registro
  poll.pollName = req.body.title

  // Iterate over poll entries (except title) and call addOption method to add
  // each one to the document
  Object.keys(req.body).slice(1).forEach( key => {
    console.log(key);
    poll.addOption(req.body[key])
  });

  // Save poll to database
  poll.save( (err) => {
    if (err) throw err;
    return poll;
  });
}
