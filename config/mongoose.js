//-------------------------- Import the mongoose library ------------------------//
const mongoose = require('mongoose');
const { encode } = require('querystring'); 



//-------------------------- Encode the password --------------------------------//
const password = '12345';

//------------------------- incrypted -------------------------------------------//
const encodedPassword = encode('12345', 'utf8');
// console.log(encodedPassword);

//------------------ Create the MongoDB connection URL with the encoded password ----------------//
const dbURI = `mongodb+srv://vishal:${password}@auth.fejt9om.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(dbURI, {
    // Options can be added here if needed
});

//---------------- Get a reference to the default Mongoose connection --------------------------//
const db = mongoose.connection;

//---------------- Listen for the ERROR event on the Mongoose connection ----------------------//
db.on('error', console.error.bind(console, "Error in connecting MongoDB"));

//------------------------ Listen for the OPEN event on the Mongoose connection ---------------//
db.once('open', function () {
    console.log("Connected to Database :: MongoDB");
});

//----------------------- Export the Mongoose -------------------------------------------------//
module.exports = db;