const morgan = require('morgan');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRoute');

const app = express();

//1 GLOBAL MIDDLEWAREs
app.use(helmet()); //Set Security HTTP heanders

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Allow 100 request from the same IP for one hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 64 * 1000,
  message: 'Too many request from this IP, Please try again in an hour!',
});
app.use('/api', limiter); // protect all the route that start /api

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whilelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'price',
    ],
  }),
);

// Serving static file
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3/ Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
