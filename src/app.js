const express = require('express');
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const morganLogger = require('./middleware/morganLogger');
const Router = require('../src/route/index');
const errorHandler  = require('./middleware/errorHandler');


const app = express();

// middleware to handle an incoming request and also Support json encoded bodies
app.use(express.json()); 

app.use(morganLogger());

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

// secure HTTP headers setting middleware
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// Allow cross-origin resource sharing
app.use(cors({ origin: '*' }));

app.use(helmet());

// Prevent parameter pollution
app.use(hpp());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());



app.use('/api/v1', Router);


// Global Error handler
app.use(errorHandler);

module.exports = app;