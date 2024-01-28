const express = require('express');
require("dotenv").config();

const port = process.env.PORT || 8000;
const app = express();



//connect monogodb
const db = require('./config/mongoose');  //it is important to require it beacause we need connect mongoDB (code to connect mongoDB is written in this page)

//to use cookies we need cookie-parser library
const cookieParser = require('cookie-parser');

//all library for session and authentication
const MongoStore = require('connect-mongo');   //use to store the session in DB so that when server restarted it should not get lost
const passport = require('passport');
const session = require('express-session');
//different strategies to authenticate user using passport
const passportls = require('./config/passport-local-strategy')
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogleAuth=require('./config/passport-google-oauth2-strategy');

//SASS library
const sassMiddleware = require('node-sass-middleware');

//library to use Layout.ejs files
const expressLayouts=require('express-ejs-layouts');

//flash library(to show success or error message flash)
var flash = require('connect-flash');
//file with custom middleware written
const customMware= require('./config/middleware');


// set up the chat server to be used with Socket.io for chat engine note:- it run over node.js http module not express
const http = require('http');
const server = http.createServer(app);
const chatSockets=require('./config/chat_sockets').chatSockets(server);   //call the chatSockets fn by sending chatServer, so that it(chat_sockets.js file of config) can use this chat server


//setting up sass file for css

app.use(sassMiddleware({
    src: './public/scss' ,
    dest: './public/css' ,
    debug: true,
    outputStyle: 'extended',
    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}))


// setup layout
app.use(expressLayouts);


//parsing form data to get data in req.body //it shoud be before routing
app.use(express.urlencoded());
//setup cookie parser
app.use(cookieParser());


//set up the view engine
app.set("view engine", 'ejs');
app.set("views", './views');  //not necessary
//setup static folder
app.use(express.static('./public'));



//setup express-session and passport
app.use(session({
    name: 'connectify',
    //TODO : change secret before deplyoying
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: (1000 * 60 * 100) },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/connectifyDB',
        autoRemove: 'disabled'
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//setup flash libarray to show flash messages
app.use(flash());
app.use(customMware.setFlash);


//use express router (i.e indexRouter)
app.use('/', require('./routes/index')); 

server.listen(port, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`app running at port: ${port}`);
})