require('dotenv').config();
const restify = require('restify');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const {
  badges, conditions, markerlocations, markers, metrics, savedtrips, userbadges, users, usersmetrics,
} = require('../db/index').models;

const server = restify.createServer({
  name: 'Strictly Bikes',
  version: '1.0.0'
});

const transformGoogleProfile = (profile) => ({
  name: profile.displayName,
  imageUrl: profile.photos[0].value,
  email: profile.emails[0],
});

passport.use(new GoogleStrategy({
  clientID: process.env.WEB_CLIENT_ID,
  clientSecret: process.env.WEB_CLIENT_SECRET,
  callbackURL: process.env.WEB_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    done(null, transformGoogleProfile(profile));
  } catch (err) {
    console.error(err);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(passport.initialize());
server.use(passport.session());

server.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'], accessType: 'offline'
}));

server.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res, next) => {
    res.redirect(`OAuthLogin://login?user=${JSON.stringify(req.user)}`, next)
  });

server.get('/', (req, res) => {
  res.send('~Strictly Bikes~');
});

server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});