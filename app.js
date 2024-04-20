import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import flash from 'connect-flash';
import passport from 'passport';
import { initializingPassport } from './passportConfig.js';

import { indexRouter } from './routes/index.js';
import { userRouter } from './routes/users.js';

export const app = express();
export const port = 3000;

// view engine setup
app.set('view engine', 'ejs');

// store client send data
app.use(session({
  resave: false, // if session value not change then dont resave the value
  saveUninitialized: false, // ignore those data which have no name
  secret: process.env.SESSION_SECRET // encrypt the data on behalf of this secret key
}));

app.use(passport.initialize());
app.use(passport.session());
initializingPassport(passport)

app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
