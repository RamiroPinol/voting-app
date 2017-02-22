const mongoose = require('mongoose');

// Schema to define poll object
const pollSchema = mongoose.Schema({
  userId   : String, // The _id added when user signs-in
  pollName : String,
  options  : []
})

// Method to add an option to poll's object
pollSchema.methods.addOption = function(option) {
  const obj = {}
  obj["option"] = option
  obj["votes"] = 0
  return this.options.push(obj)
}

module.exports = mongoose.model('Poll', pollSchema)
