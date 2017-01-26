let Pool = function(obj) {

  // Syntax: Pool.getPool(DATA (object), USER_ID (number), POOL_ID (number))
  // Searches for pool with pool_id ID.
  // Returns array: [{Username: USERNAME}, {PoolName: POOLNAME}, {Pool options Object}]
  this.getPool = function(obj, id, pool_id) {
    let userName;
    const res = obj.users.map( user => {
      if (user.user_id == id) {
        userName = user.user_name
        return user.pools[pool_id]
      }
    })
    const filt = res.filter( pool => { return pool })[0]
    
    return [{userName : userName}, {poolName : filt.pool_name}, filt.options]
  }

  this.getOptions = function(pool) {
    let result = []
    for (var key in pool) {
      if ( pool.hasOwnProperty(key) && key.includes("opt") ) {
        result.push(pool[key])
      }
    }
    return result
  }

}

module.exports = Pool
