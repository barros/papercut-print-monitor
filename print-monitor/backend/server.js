require('dotenv').config({path:'../.env'});
var express = require('express');
var axios = require('axios');

var app = express();

const port = 5000;

const paperCutAPIPath = "https://testpapercut.bc.edu/api/"

// Save printers in a dictionary for now, will change to a mongodb instance soon
var printers = {};

app.use(function (req, res, next) {
  // Allow CORS from all origins
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Pass to next layer of middleware
  next();
});

// Get printers that are currently saved
app.get('/printers', (req, res) => {
  // fetch printers from db
  res.json(printers);
});

// Trigger a refresh of statuses and get updates
app.get('/refresh', (req, res) => {
  // ping PaperCut API to update statuses then return updates
  console.log('refreshing printers');
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  // Initialize first status update
  const url = `${paperCutAPIPath}health/printers`;
  const headerConfig = {
    headers: { "Authorization": process.env.PAPERCUT_API_KEY }
  };

  axios.get(url, headerConfig)
  .then(res => addPrinters(res.data))
  .catch(err=>console.log(err));
  
  console.log(`Backend API server is running on ${host}:${port}`);
})

// convert API response data to printer dictionary
addPrinters = (data) => {
  const retreived = data.printers;
  retreived.forEach(printer => {
    const name = printer.name;
    printers[name] = printer
  });
  console.log(printers);
}