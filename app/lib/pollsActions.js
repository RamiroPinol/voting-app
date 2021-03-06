const Poll = require('../models/pollModel');
const poll = new Poll()

// Create poll
exports.createPoll = (req) => {
  process.nextTick( () => {
    poll.userId   = req.user._id  //_id de registro
    poll.pollName = req.body.title

    // Iterate over poll entries (except title) and call addOption method to add
    // each one to the document
    Object.keys(req.body).slice(1).forEach( key => {
      poll.addOption(req.body[key])
    });

    // Save poll to database
    poll.save( (err) => {
      if (err) throw err;
      return poll;
    });
  })
}

// Find all polls
exports.findAllPolls = (req, res) => {
  process.nextTick( () => {
    Poll.find({}, (err, polls) => {
      if (err) throw err
      res.render('index', {
        polls: polls
      })
    })
  })
}

// Find polls of current logged in user
exports.findByUser = (req, res) => {
  process.nextTick( () => {
    Poll.find({ userId : req.user._id}, (err, polls) => {
      if (err) throw err
      res.render('profile.ejs', {
        polls: polls,
        user : req.user // get the user from the session
      });
    })
  })
}

// Delete poll
exports.delete = (id) => {
  process.nextTick( () => {
    Poll.remove({ _id : id })
  })
}
