require('dotenv').config();
const restify = require('restify');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const server = restify.createServer({
  name: 'Strictly Bikes',
  version: '1.0.0'
});

const transformGoogleProfile = (profile) => ({
  name: profile.displayName,
  avatar: profile.image.url,
});

passport.use(new GoogleStrategy({
  clientID: process.env.WEB_CLIENT_ID,
  clientSecret: process.env.WEB_CLIENT_SECRET,
  callbackURL: process.env.WEB_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  done(null, transformGoogleProfile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(passport.initialize());
server.use(passport.session());

server.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

server.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => {
    res.redirect(`OAuthLogin://login?user=${JSON.stringify(req.user)}`)
  });

server.get('/', (req, res) => {
  res.send('~Strictly Bikes~');
});

server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});