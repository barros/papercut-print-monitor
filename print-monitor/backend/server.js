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
var locSubscriptions = [[]];

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
  setInterval(requestPaperCutStatus, 10000);

  console.log(`Backend API server is running on ${host}:${port}`);
});

/*
  Socket Handling
*/
io.on('connection', (socket) => {
  console.log(`socket id (${socket.id}) connected`)
  locSubscriptions[0].push(socket.id);

  // Get a status update of a specific location
  socket.on('get', (locID) => {
    emitToSocket(locID, socket.id);
  });

  // A refresh request will refresh the entire database and refresh all sockets
  socket.on('refresh', () => {
    requestPaperCutStatus();
  });

  // Change subscription channel, occurs when a user changes location via button drop-down
  socket.on('sub change', (subscriptionData) => {
    // Location socket was previously subscribed to
    let prevSub = subscriptionData.prevSub;
    // New location socket is subscribed to
    let newSub = subscriptionData.newSub;
    const indexToDelete = locSubscriptions[prevSub].indexOf(socket.id);

    if (indexToDelete!==-1){
      // Remove socket ID from old subscription channel
      locSubscriptions[prevSub].splice(indexToDelete, 1);
      // Subscribe socket ID to new location
      if (locSubscriptions[newSub]){
        locSubscriptions[newSub].push(socket.id);
      } else {
        locSubscriptions[newSub] = [socket.id];
      }
    }
    // Update the socket the printers of their new subscription
    emitToSocket(newSub, socket.id);
  });

  socket.on('disconnect', () => {
    // Remove socket ID from any subscribed channels
    for (subscriptions of locSubscriptions){
      const indexToDelete = subscriptions.indexOf(socket.id);
      if (indexToDelete!==-1){
        subscriptions.splice(indexToDelete, 1);
      }
    }
  })
});
/*
----------------------------------------------------------
*/

// Emit specific location printers to specific socket
function emitToSocket(locID, socketID){
  if (locID==0){ // Query all locations
    collection.find({}).toArray(function(err, result) {
      if (err) throw err;
      io.to(socketID).emit('updated printers', { printers: result, lastUpdate: lastPrinterUpdate });
    });
  } else if (locID==1){ //  // Query O'Neill Library
    collection.find({ "name" : { $regex : "oneill" } }).toArray(function(err, result) {
      if (err) throw err;
      io.to(socketID).emit('updated printers', { printers: result, lastUpdate: lastPrinterUpdate });
    });
  }
}

// Request printer statuses from PaperCut API then update MongoDB
function requestPaperCutStatus(){
  axios.get(paperCutAPIPath)
  .then(res => updateDB(res.data))
  .catch(err=>console.log(err));
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
  });
  batch.execute((err, result) => {
    if (err){
      console.log('ERROR IN MONGODB BULK OPERATION');
      throw err;
    }
    console.log('Update completed at: ' + new Date());
    lastPrinterUpdate = new Date();
    console.log(`Bulk operation result: ${result}`);
    // Emit updates to socket clients
    updateSocketClients();
  });
  batch = collection.initializeUnorderedBulkOp();
}

// Update sockets with their respective subscriptions
function updateSocketClients(){
  for (locID in locSubscriptions){
    if (locID==0){ // Query all locations
      collection.find({}).toArray(function(err, result) {
        if (err) throw err;
        for (socketID of locSubscriptions[locID]){
          if (socketID){
            io.to(socketID).emit('updated printers', { printers: result, lastUpdate: lastPrinterUpdate });
          }
        }
      });
    } else if (locID==1){ // Query O'Neill Library
      collection.find({ "name" : { $regex : "oneill" } }).toArray(function(err, result) {
        if (err) throw err;
        io.to(socketID).emit('updated printers', { printers: result, lastUpdate: lastPrinterUpdate });
      });
    }
  }
}