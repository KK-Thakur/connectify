const mongoose= require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/connectifyDB");

const db=mongoose.connection;

//if error
db.on('error', console.error.bind('console','error connecting to db'));

//if connected
db.once('open', ()=>{
    console.log("Succesfully connected to db");
})


/*const mongoose= require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/connectifyDB');

 //Get the default connection
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

*/