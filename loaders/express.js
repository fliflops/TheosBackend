const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const compression = require('compression')
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const moment = require('moment');
const api     = require('../api');
// const auth    = require('../services/auth');
// const middleWare = require('../middleware/compression');

module.exports = async(app) => {
    //Load Headers
    app.use(morgan('dev'));
    app.use(cors())
    // app.use(helmet());
    app.use(express.json({limit: '50mb'}));
    app.use(express.urlencoded({extended:true}));
    
    //# HANDLEBARS HELPERS
    Handlebars.registerHelper("inc", function(value, options) {
      return parseInt(value) + 1;
    });
    Handlebars.registerHelper('formatTime', function (date) {
      // console.log(date)
      var mmnt = moment(date);
      // console.log(mmnt.format('YYYY-MM-DD HH:mm:ss'))
      // console.log(new Date(mmnt.format('YYYY-MM-DD HH:mm:ss')).toISOString().replace('.000','').replace('Z','').replace('T',' '))
      if(date == null) {
          return null;
      }
      return new Date(mmnt.format('YYYY-MM-DD HH:mm:ss')).toISOString().replace('.000','').replace('Z','').replace('T',' ')
      // return mmnt.format('YYYY-MM-DD HH:mm:ss'); //BACKUP
    });
    Handlebars.registerHelper('formatTimeHHSS', function (date) {
      var mmnt = moment(date);
      if(date == null) {
          return null;
      }
      return new Date(mmnt.format('YYYY-MM-DD HH:mm:ss')).toISOString().replace('.000','').replace('Z','').replace('T',' ').slice(0,16)
    });
    Handlebars.registerHelper('formatDate', function (date) {
      var mmnt = moment(date);
      if(date == null){
          return null
      }
      // return mmnt.toISOString().replace('.000','').replace('Z','').replace('T','  ').slice(0,12);
      return mmnt.format('YYYY-MM-DD');
    });
    // Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

    Handlebars.registerHelper('compare', (lvalue, rvalue, options) => {
      if (arguments.length < 3) throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
      var operator = options.hash.operator || "==";
      var operators = {
          '==':       function(l,r) { return l == r; },
          '===':      function(l,r) { return l === r; },
          '!=':       function(l,r) { return l != r; },
          '<':        function(l,r) { return l < r; },
          '>':        function(l,r) { return l > r; },
          '<=':       function(l,r) { return l <= r; },
          '>=':       function(l,r) { return l >= r; },
          'typeof':   function(l,r) { return typeof l == r; }
      }
      if(!operators[operator]) throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
      var result = operators[operator](lvalue, rvalue);
      if(result) {
          return options.fn(this);
      }
      else {
        return options.inverse(this);
      }
    });

    //# VIEW ENGINE
    await app.set('views', path.join(__dirname, '../views'));
    await app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
    await app.set('view engine', 'handlebars');
    await app.use(express.static(path.join(__dirname, '../public')));
    
    await app.use(session({
      secret:'happy dog',
      saveUninitialized: true,
      resave: true
    }));

    await app.use(flash());

    await app.use(function (req, res, next){
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
    });

    // app.use(auth)
    // app.use(compression({filter:shouldCompress}));

    //Load API Routes
    app.use(api);

    console.log('Express has been Initialized');
}

function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
  }
