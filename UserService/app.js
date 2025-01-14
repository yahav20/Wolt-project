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
const morgan = require('morgan');

console.log(process.env.NODE_ENV);
require('custom-env').env(process.env.NODE_ENV,'./config');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mydatabase';

mongoose.connect(MONGO_URI)
var app = express();
app.use(morgan('combined'));

app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true })); // For managing sessions
app.use('/users', users);
app.use('/login', login);
app.use('/signup', signup)
app.listen(3000);