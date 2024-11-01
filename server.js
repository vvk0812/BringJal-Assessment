const UserRoute = require('./app/routes/route.js')
const Auth = require('./app/middleware/refreshtoken.js')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const cors = require("cors")
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/',UserRoute)
app.use(Auth);
//app.use(handleJwtError);


const mongoose = require('mongoose');
const dbConfig = require('./config/database.config.js');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 20000 // Increase the timeout
}).then(() => {
    console.log("Database Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database:', err);
    process.exit();
});

app.get('/', (req, res) => {
    res.json({"message": "Hello Bringjal Assessment"});
});
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});




//Sample Code Tested For The Serverless Running for testing Lambda Fuction Using handler.js file 

// app.js

// const UserRoute = require('./app/routes/route.js');
// const Auth = require('./app/middleware/refreshtoken.js');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require("cors");
// const mongoose = require('mongoose');
// const dbConfig = require('./config/database.config.js');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use('/', UserRoute);
// app.use(Auth);

// // Routes
// app.get('/', (req, res) => {
//     res.json({ "message": "Hello Bringjal Assessment" });
// });

// // Database connection
// mongoose.Promise = global.Promise;
// mongoose.connect(dbConfig.uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     connectTimeoutMS: 20000
// }).then(() => {
//     console.log("Database Connected Successfully!!");
// }).catch(err => {
//     console.log('Could not connect to the database:', err);
//     process.exit();
// });

// module.exports = app; // Export the Express app without starting the server
