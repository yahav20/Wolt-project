const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const users = require('./routes/user');
const login = require('./routes/login');
const dashboard = require('./routes/dashboard');
const signup = require('./routes/signup');
const signout = require('./routes/signout')
const session = require('express-session');
console.log(process.env.NODE_ENV);
require('custom-env').env(process.env.NODE_ENV,'./config');
mongoose.connect(process.env.CONNECTION_STRING)

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true })); // For managing sessions
app.use('/users', users);
app.use('/', login);
app.use('/login', login);
app.use('/dashboard', dashboard)
app.use('/signup', signup)
app.use('/signout', signout)
app.listen(process.env.PORT);