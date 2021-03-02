const createError = require("http-errors"),
express = require("express"),
cookieParser = require("cookie-parser"),
redis = require("redis"),
session = require("express-session"),
expressLayouts = require("express-ejs-layouts"),
bodyParser = require("body-parser"),
logger = require("morgan");
validate = require("express-validator"),
path = require("path"),
flash = require("connect-flash"),
$ = require('jquery'),
helmet = require('helmet'),

/* CSRF */
csurf = require('csurf'),

// 1.Below code for storing session in DB
SequelizeStore = require('connect-session-sequelize')(session.Store),

{ Sequelize, connection } = require('./config/db');

/* let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient(); */

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var clientRouter = require('./routes/clients');
var gmsUsersRouter = require('./routes/gmsUsers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/assets')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());


// 2.Below code for storing session in DB
var myStore = new SequelizeStore({
  db: connection,
  expiration: 24 * 60 * 60 * 1000
});

// Connect flash
app.use(flash());
app.use(
  session({
    secret: "thequickbrownfoxjumpoverlazydog",
    store: myStore,
    //store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    SameSite: true
    /* cookie: { maxAge: 60000 }, */
  })
);

app.use(csurf());



// myStore.sync();
// Global variables
app.use(function (req, res, next) {
  // console.log('hello');
  
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.isLogin = req.session.isLogin;
  res.locals.pass = req.csrfToken();

  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/client', clientRouter);
app.use('/gmsUsers', gmsUsersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
