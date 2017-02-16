const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/userModelAuth');
const configAuth = require('./auth');

module.exports = (passport) => {

  passport.serializeUser( (user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });


  // Local signup and login
  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  (req, email, password, done) => {

    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick( () => {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email' :  email }, (err, user) => {
        if (err)
          return done(err);

        // check to see if theres already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

          // if no user with that email, create new user
          const newUser = new User();
          newUser.local.email    = email;
          newUser.local.password = newUser.generateHash(password);

          newUser.save( (err) => {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });

    });

  }));

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  (req, email, password, done) => {

    User.findOne({ 'local.email' :  email }, (err, user) => {
      if (err)
        return done(err);

      // if no user is found, return the message
      if ( !user )
        return done(null, false, req.flash('loginMessage', 'No user found.'));

      // if the user is found but the password is wrong
      if ( !user.validPassword(password) )
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

      // all is well, return successful user
      return done(null, user);
      });

  }));



  // Facebook
  passport.use(new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL

  },

  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {

    process.nextTick(function() {

      // find the user in the database based on their facebook id
      User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser = new User();

          // set all of the facebook information in our user model
          newUser.facebook.id    = profile.id; // set the users facebook id
          newUser.facebook.token = token; // we will save the token that facebook provides to the user
          newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
          newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

          // save our user to the database
          newUser.save(function(err) {
            if (err) throw err;

            return done(null, newUser);
          });
        }

      });
    });
  }));



  passport.use(new TwitterStrategy({

    // pull in our app id and secret from our auth.js file
    consumerKey     : configAuth.twitterAuth.consumerKey,
    consumerSecret  : configAuth.twitterAuth.consumerSecret,
    callbackURL     : configAuth.twitterAuth.callbackURL

  },

  function(token, refreshToken, profile, done) {

    process.nextTick(function() {

      // find the user in the database based on their twitter id
      User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that twitter id, create them
          var newUser = new User();

          // set all of the twitter information in our user model
          newUser.twitter.id    = profile.id; // set the users twitter id
          newUser.twitter.token = token; // we will save the token that twitter provides to the user
          newUser.twitter.displayName  = profile.displayName; // look at the passport user profile to see how names are returned
          newUser.twitter.username = profile.username; // twitter can return multiple emails so we'll take the first

          // save our user to the database
          newUser.save(function(err) {
            if (err) throw err;

            return done(null, newUser);
          });
        }

      });
    });
  }));



  passport.use(new GoogleStrategy({

    clientID        : configAuth.googleAuth.clientID,
    clientSecret    : configAuth.googleAuth.clientSecret,
    callbackURL     : configAuth.googleAuth.callbackURL

  },

  function(token, refreshToken, profile, done) {

    process.nextTick(function() {

      // find the user in the database based on their google id
      User.findOne({ 'google.id' : profile.id }, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that google id, create them
          var newUser = new User();

          // set all of the google information in our user model
          newUser.google.id    = profile.id; // set the users google id
          newUser.google.token = token; // we will save the token that google provides to the user
          newUser.google.name  = profile.displayName; // look at the passport user profile to see how names are returned
          newUser.google.email = profile.emails[0].value; // google can return multiple emails so we'll take the first

          // save our user to the database
          newUser.save(function(err) {
            if (err) throw err;

            return done(null, newUser);
          });
        }

      });
    });
  }));

};
