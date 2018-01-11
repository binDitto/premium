const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// INITIALIZE APP
const app = express();

// ADD DATABASE
const mongoose = require('mongoose');
const config = require('./config/database');
      mongoose.connect(config.database);
      mongoose.connection.on('connected', () => {
        console.log(`You are now connected to: ${config.dbname}`);
      });
      mongoose.connection.on('error', (err) => {
        console.log(`Error connecting to database: ${err}`);
      });

// USE CORS FOR SETTING HEADERS TO ALLOW MAKING REQUEST FROM DIFF DOMAIN/URL
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:4200'
}));


// SET FOLDER WHERE NODE SERVER WILL READ FRONT END FILES FROM -- FRONT END STATIC DIRECTORY
// REMEMBER TO SET THIS IN ANGULAR/CLI FILE IN ANGULAR TO CREATE THIS FOLDER WHEN NG BUILDING
app.use(express.static(__dirname + '/public'));


// MORGAN FOR MORE CONSOLE LOG STUFF
app.use(morgan('dev'));

// PARSE FRONT END DATA INTO READABLE JSON FORMAT
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



// APP ROUTES
const storeRoutes = require('./api/routes/store');
app.use('/store_info', storeRoutes);

// '*' means all other unespecified routes will sned the index.html in public folder
app.get('*', (req, res) => {
    res.status(404).send('Error hello world');
    // res.sendFile(path.join(__dirname + '/public/index.html'));
});

// SET PORT
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`);
});

