module.exports = (app, passport) => {

  // INDEX
  app.get('/', (req, res) => {
    res.render('index.ejs');
  });

  // LOGIN PAGE
  app.get('/login', (req, res) => {
    res.render('login.ejs', {
      message: req.flash('loginMessage'),
      icon: "sign-in",
      action: "Login",
      alternative: "Signup",
      text: "Need an account?",
      linkLocal: false
    });
  });

  // PROCESS LOGIN FORM
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true // allow flash messages
  }));

  // SIGNUP PAGE
  app.get('/signup', (req, res) => {
    res.render('login.ejs', {
      message: req.flash('signupMessage'),
      action: "Signup",
      alternative: "Login",
      text: "Already have an account?",
      icon: "sign-in",
      linkLocal: false
    });
  });

  // PROCESS SIGNUP FORM
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  // USER PROFILE PAGE
  // Uses isLoggedIn middleware function to check is user is authenticated
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user : req.user // get the user from the session
    });
  });



// =============================================================================
// 3RD-PARTIES AUTHENTICATION ROUTES ===========================================
// =============================================================================
  // '/auth/SITE' to authenticate user, when done redirects to the other route

  // FACEBOOK ROUTES
  // Route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect : '/profile',
                                        failureRedirect : '/'
  }));


  // TWITTER ROUTES
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/profile',
                                       failureRedirect: '/'
  }));


  //GOOGLE ROUTES
  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { successRedirect: '/profile',
                                      failureRedirect: '/'
  }));



// =============================================================================
// 3RD-PARTIES AUTHORIZE (Already logged in or connecting other 3rd-partie account)
// =============================================================================

  // LOCAL
  app.get('/connect/local', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage'),
      icon: "user",
      action: "Add local account",
      linkLocal: true
    });
  });

  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/connect/local',
    failureFlash : true
  }));


  // FACEBOOK
  app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

  app.get('/connect/facebook/callback',
    passport.authorize('facebook', { successRedirect : '/profile',
                                     failureRedirect : '/'
  }));


  // TWITTER
  app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

  app.get('/connect/twitter/callback',
    passport.authorize('twitter', { successRedirect : '/profile',
                                    failureRedirect : '/'
  }));


  // GOOGLE
  app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

  app.get('/connect/google/callback',
    passport.authorize('google', { successRedirect : '/profile',
                                   failureRedirect : '/'
  }));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', function(req, res) {
      var user            = req.user;
      user.local.email    = undefined;
      user.local.password = undefined;
      user.save(function(err) {
          res.redirect('/profile');
      });
  });

  // facebook -------------------------------
  app.get('/unlink/facebook', (req, res) =>{
    unlink("facebook", req, res)
  })

  // twitter --------------------------------
  app.get('/unlink/twitter', (req, res) =>{
    unlink("twitter", req, res)
  })

  // google ---------------------------------
  app.get('/unlink/google', (req, res) =>{
    unlink("google", req, res)
  })


// LOGOUT ROUTE
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

// Middleware to verify if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

// Middleware to unlink social net account
function unlink(service, req, res) {
  var user          = req.user;
  user[service].token = undefined;
  user.save(function(err) {
     res.redirect('/profile');
  })
}
