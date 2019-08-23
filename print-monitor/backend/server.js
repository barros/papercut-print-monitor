require('dotenv').config({path:'../.env'});
var express = require('express');
var axios = require('axios');
const BodyParser = require("body-parser");

// MongoDB Setup 
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

// Global Variables
const CONNECTION_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@papercut-test-o3cqg.mongodb.net/test?retryWrites=true&w=majority`;
const DATABASE_NAME = 'test';
var database, collection;

var app = express();
const port = 5000;

const paperCutAPIPath = `${process.env.PAPERCUT_API_URL}/health/printers?Authorization=${process.env.PAPERCUT_API_KEY}`;

// Middleware
app.use(function (req, res, next) {
  // Allow CORS from all origins
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Pass to next layer of middleware
  next();
});
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

// Start server
var server = app.listen(port, () => {
  var host = server.address().address;
  var port = server.address().port;

  // Connect to MongoDB
  MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if(error) {
      throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection("printers");
    console.log("Connected to `" + DATABASE_NAME + "`");
  });

  // Give the server 2 seconds to connect to database before fetching and adding statuses
  setTimeout(requestPaperCutStatus, 2000);

  // Refresh and update printer statuses every minute
  setInterval(requestPaperCutStatus, 60000);

  console.log(`Backend API server is running on ${host}:${port}`);
});

// ---------------- Routes ----------------
// Get printers that are currently saved
app.get('/printers', (req, res) => {
  // fetch printers from db
  collection.find({}).toArray(function(err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// Trigger a refresh of statuses and get updates
app.get('/refresh', (req, res) => {
  // ping PaperCut API to update statuses then return updates
  console.log('refreshing printers');
});
// ----------------------------------------

// Request printer statuses from PaperCut API then update MongoDB
function requestPaperCutStatus(){
  axios.get(paperCutAPIPath)
  .then(res => addPrinters(res.data))
  .catch(err=>console.log(err));
}


// Insert/Update printers received from PaperCut API to MongoDB database
function addPrinters(data){
  const retreived = data.printers;
  retreived.forEach(printer => {
    // Remove the 'four' server name that is prepended to all BC PaperCut printers
    var printerName = printer.name.replace('four\\', '');
    // Record to push to database
    let record = {
      'name': printerName,
      'status': printer.status,
      'lastModified': new Date()
    }

    var query = { name: { $eq: printerName } };
    var data = { $set: record };
    
    // Set 'upsert = true' so that printers that exist on DB get updated and those that don't get added
    collection.updateOne(query, data, { upsert: true }, (err, collection) => {
      if (err) throw err;
      console.log("Record updated successfully");
    });
  });
  console.log('Update completed at: ' + new Date());
}