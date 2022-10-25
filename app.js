const createError = require('http-errors');
const express = require('express');
const Sentry = require('@sentry/node');
const expressSession = require('express-session')
const Tracing = require("@sentry/tracing");
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

const app = express();

// Sentry initialization
Sentry.init({ 
  dsn: "https://afaae32b3c3446b5a401e0bcc7330f70@o4503987293061120.ingest.sentry.io/4503987296403458",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// setting enverionmental variables
dotenv.config();

// Express Session
app.use(expressSession({
  secret: 'hiddenkeyhiddenkey',
  resave: 'false',
  saveUninitialized: true
}))


// view engine setup
app.use(expressLayouts)
app.set('layout', './layouts/full-width');
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// The middleware which determines what is shown to users
app.use((req, res, next) => {
  const user = req.session.user
  if(user) {
      res.locals = {
          displayLogButtons: false
      }
  } else {
      res.locals = {
        displayLogButtons: true
      }
  }
  next()
})

// Cookies Middleware
app.use((req, res, next) => {
  //Flash Message
  res.locals.sessionFlash = req.session.sessionFlash
  delete req.session.sessionFlash
  //Product Variation
  res.locals.selectedProductVariants = req.session.selectedProductVariants
  next()
})

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//Sentry error handler
app.use(Sentry.Handlers.errorHandler());

// error handler
app.use(function onError(err, req, res, next) {
  res.statusCode = 500
  res.end(res.sentry + "\n")
});

module.exports = app;
