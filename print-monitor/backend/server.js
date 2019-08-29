require('dotenv').config({path:'../.env'});
var express = require('express');
const BodyParser = require("body-parser");
var app = express();
const server = require('http').createServer(app); // server instance
var axios = require('axios');
const socketIO = require('socket.io');
const io = socketIO(server); // creates our socket using the instance of the server


// MongoDB Setup 
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

// Global Variables
const CONNECTION_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@papercut-test-o3cqg.mongodb.net/test?retryWrites=true&w=majority`;
const DATABASE_NAME = 'test';
var database, collection, batch;
const port = 5000;
var lastPrinterUpdate;

const paperCutAPIPath = `${process.env.PAPERCUT_API_URL}/health/printers?Authorization=${process.env.PAPERCUT_API_KEY}`;

// Middleware
app.use(function (req, res, next) {
  // Allow CORS from all origins
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  res.setHeader('Content-Type', 'application/json');
  // Pass to next layer of middleware
  next();
});
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

// Start server
server.listen(port, () => {
  var host = server.address().address;
  var port = server.address().port;

  // Connect to MongoDB
  MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if(error) {
      throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection("printers");
    /*
      Add the printers to DB in a batch so that there can be one callback when data is inserted/updated
      Callback would only work for each collection.updateOne call
    */
    batch = collection.initializeUnorderedBulkOp();
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
  handleGETPrinters(res);
});

// Trigger a refresh of statuses and get updates
app.get('/refresh', (req, res) => {
  // Ping PaperCut API to update statuses then return updates
  console.log('refreshing printers');
});
// ----------------------------------------

io.on('connection', (socket) => {
  socket.on('get printers', (res) => {
    collection.find({}).toArray(function(err, result) {
      if (err) throw err;
      io.sockets.emit('updated printers', { printers: result, lastUpdate: lastPrinterUpdate });
      // let json = {
      //   lastUpdate: lastPrinterUpdate,
      //   printers: result
      // }
      // response.json(json);
    });
  });

  socket.on('refresh', () => {
    requestPaperCutStatus();
  });
});

// Request printer statuses from PaperCut API then update MongoDB
function requestPaperCutStatus(){
  axios.get(paperCutAPIPath)
  .then(res => refreshPrinters(res.data))
  .catch(err=>console.log(err));
}

function refreshPrinters(data){
  updateDB(data);
  // Promise.all([updateDB(data), updateSocketClients()])
  // .then((values) => {
  //   // console.log(values)
  // })
  // .catch((err) => {
  //   throw err;
  // })
}

// Send printers to socket clients
function updateSocketClients(){
  collection.find({}).toArray(function(err, result) {
    if (err) throw err;
    io.sockets.emit('updated printers', { printers: result, lastUpdate: lastPrinterUpdate });
    // return result;
  });
}

// Send printers through an HTTP response
function handleGETPrinters(response){
  collection.find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log('in handleGETPrinters(): ' + result)
    let json = {
      lastUpdate: lastPrinterUpdate,
      printers: result
    }
    response.json(json);
  });
}


// Insert/Update printers received from PaperCut API to MongoDB database
function updateDB(data){
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

    var query = { name: printerName };
    var data = { $set: record };
    
    // Call 'upsert()' so that printers that exist on DB get updated and those that don't get added
    batch.find(query).upsert().update(data)
    // collection.updateOne(query, data, { upsert: true }, (err, collection) => {
    //   if (err) throw err;
    //   console.log("Record updated successfully");
    //   console.log(collection)
    // });
  });
  batch.execute((err, result) => {
    if (err){
      console.log('ERROR IN MONGODB BULK OPERATION');
      throw err;
    }
    console.log('Update completed at: ' + new Date());
    lastPrinterUpdate = new Date();
    console.log(`Bulk operation result: ${result}`);
    // emit updates to socket clients
    updateSocketClients();
  });
  batch = collection.initializeUnorderedBulkOp();
}