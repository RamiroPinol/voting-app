let Poll = function(obj) {

  // Syntax: Poll.getPoll(DATA (object), USER_ID (number), POOL_ID (number))
  // Searches for poll with poll_id ID.
  // Returns array: [{Username: USERNAME}, {PollName: POOLNAME}, {Poll options Object}]
  this.getPoll = function(obj, id, poll_id) {
    let userName;
    const res = obj.users.map( user => {
      if (user.user_id == id) {
        userName = user.user_name
        return user.polls[poll_id]
      }
    })
    const filt = res.filter( poll => { return poll } )[0]

    return [{userName : userName}, {pollName : filt.poll_name}, filt.options]
  }

  this.getOptions = function(poll) {
    let result = []
    for (var key in poll) {
      if ( poll.hasOwnProperty(key) && key.includes("opt") ) {
        result.push(poll[key])
      }
    }
    return result
  }

}

module.exports = Poll
