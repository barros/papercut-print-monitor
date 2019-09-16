require('dotenv').config({path:'../.env'});
var express = require('express');
var https = require('https');
const BodyParser = require('body-parser');
var app = express();
const server = require('http').createServer(app); // server instance
var axios = require('axios');
const socketIO = require('socket.io');
const io = socketIO(server); // creates our socket using the instance of the server

// MongoDB Setup 
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

// Global Variables
const environment = 'production' // 'production' for pinging PaperCut production server, 'development' for test server

const CONNECTION_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@papercut-test-o3cqg.mongodb.net/test?retryWrites=true&w=majority`;
const DATABASE_NAME = environment == 'production' ? 'prod' : 'test'; // = 'prod' for production database, 'test' for development database
var database, collection, batch;
var lastPrinterUpdate;
// Import JSON that holds the information regarding printer locations

const subscriptionChannels = require('./locations.json').locations;

// PaperCut API path
const
  apiDomain = environment == 'production' ? process.env.PAPERCUT_PROD_API_DOMAIN : process.env.PAPERCUT_DEV_API_DOMAIN;
  apiKey = environment == 'production' ? process.env.PAPERCUT_PROD_API_KEY : process.env.PAPERCUT_DEV_API_KEY;
  paperCutAPIPath = `${apiDomain}api/health/printers?Authorization=${apiKey}`;

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
const port = 5000;
server.listen(port, () => {
  var host = server.address().address;
  var port = server.address().port;

  // Connect to MongoDB
  while (true){ // Continue reattemping DB connection if attempts fail
    try {
      MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
          console.log(error);
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection('printers');
        /*
          Add the printers to DB in a batch so that there can be one callback when data is inserted/updated
          Callback would only work for each collection.updateOne call
        */
        batch = collection.initializeUnorderedBulkOp();
        console.log(`Connected to database: ${DATABASE_NAME}`);
      });
      break;
    } catch(err){
      // Log error
      console.log('ERROR CONNECTING TO MONGODB: '+err);
    }
  }

  // Give the server 2 seconds to connect to database before fetching and adding statuses
  setTimeout(requestPaperCutStatus, 2000);

  // Refresh and update printer statuses every minute
  setInterval(requestPaperCutStatus, 60000);

  console.log(`Backend API server is running on ${host}:${port}`);
});

// Endpoint for bug reporting
app.post('/bug', function (req, res) {
  res.send('POST request for bug')
})

/*
  Socket Handling
*/
io.on('connection', (socket) => {
  console.log(`Socket ID (${socket.id}) connected`);
  socket.join('all locations')

  // Send locations to client on connection
  var locations = [];
  for (i in subscriptionChannels){
    const location = {
                    name: subscriptionChannels[i].name,
                    dropdownText: subscriptionChannels[i].dropdownText
                  }
    locations.push(location);
  }
  socket.emit('locations', { locations: locations });

  // Get a status update of a specific location
  socket.on('get', (locID) => {
    emitToSocket(locID, socket.id);
  });

  // A refresh request will refresh the entire database and refresh all sockets
  socket.on('refresh', () => {
    requestPaperCutStatus();
  });

  // Change subscription channel, occurs when a user changes location via button drop-down
  socket.on('subscription change', (subscriptionData) => {
    const oldChannel = subscriptionChannels[subscriptionData.prevSub].channel;
    const newChannel = subscriptionChannels[subscriptionData.newSub].channel;
    switchChannels(socket, oldChannel, newChannel);
    console.log(`Socket ID (${socket.id}) subscribed to ${newChannel} (left channel '${oldChannel}')`);

    // Update the socket the printers of their new subscription
    emitToSocket(subscriptionData.newSub, socket.id);
  });

  // Disconnection removes socket from subscription channel
  socket.on('disconnect', () => {
    console.log(`Socket ID (${socket.id}) disconnected`);
  });
});
/*
  End of Socket Handling
----------------------------------------------------------
*/

async function switchChannels(socket, oldChannel, newChannel){
  await socket.leave(oldChannel);
  socket.join(newChannel);
}

// Emit specific location printers to specific socket
function emitToSocket(locID, socketID){
  console.log(`Emitting '${subscriptionChannels[locID].channel}' printers to socket ${socketID}`);
  if (locID==0){ // Query all locations
    collection.find({}).toArray(function(err, result) {
      if (err) throw err;
      io.to(socketID).emit('updated printers', { printers: result, lastUpdate: lastPrinterUpdate, locationID: locID });
    });
  } else { // Query locations using channel name
    let regex = subscriptionChannels[locID].channel;
    collection.find({ 'name' : { $regex : regex } }).toArray(function(err, result) {
      if (err) throw err;
      io.to(socketID).emit('updated printers', { printers: result, lastUpdate: lastPrinterUpdate, locationID: locID });
    });
  }
}

// Request printer statuses from PaperCut API then update MongoDB
function requestPaperCutStatus(){
  // add HTTPS agent to ignore SSL error
   const agent = new https.Agent({  
    rejectUnauthorized: false
  });
  axios.get(paperCutAPIPath, { httpsAgent: agent })
  .then(res => updateDB(res.data))
  .catch(err => console.log(err));
}

// Insert/Update printers received from PaperCut API to MongoDB database
function updateDB(data){
  const retreived = data.printers;
  retreived.forEach(printer => {
    // Remove the hostname from server name that is prepended to all BC PaperCut printers
    const hostname = environment == 'production' ? 'bcprint' : 'four';
    // hostname = 'four' for testpapercut.bc.edu
    // hostname = 'bcprint' for bcprint.bc.edu
    const printerName = printer.name.replace((hostname+'\\'), '');

    // Record to push to database
    const record = {
      'name': printerName,
      'status': printer.status,
      'lastModified': new Date()
    };

    const query = { name: printerName };
    const data = { $set: record };
    
    // Call 'upsert()' so that printers that exist on DB get updated and those that don't get added
    batch.find(query).upsert().update(data);
  });
  batch.execute((err, result) => {
    if (err){
      console.log('ERROR IN MONGODB BULK OPERATION:');
      console.log(err);
    }
    console.log('Update completed at: ' + new Date());
    lastPrinterUpdate = new Date();
    console.log(`Bulk operation result: ${result}`);
    // Emit updates to socket clients, begins with channel 'all locations'
    updateAllChannels();
  });
  batch = collection.initializeUnorderedBulkOp();
}

// Update sockets with their respective subscriptions
function updateAllChannels(currentLocID=0){
  if (currentLocID<Object.keys(subscriptionChannels).length){
    console.log(`Updating subscription channel: ${subscriptionChannels[currentLocID].channel}`);
    if (currentLocID==0){
      collection.find({}).toArray(function(err, result) {
        if (err) throw err;
        io.to('all locations').emit('updated printers', { printers: result, lastUpdate: lastPrinterUpdate, locationID: currentLocID });
        updateAllChannels(++currentLocID);
      });
    } else {
      let regex = subscriptionChannels[currentLocID].channel;
      collection.find({ 'name' : { $regex : regex } }).toArray(function(err, result) {
        if (err) throw err;
        io.to(regex).emit('updated printers', { printers: result, lastUpdate: lastPrinterUpdate, locationID: currentLocID });
        updateAllChannels(++currentLocID);
      });
    }
  }
}