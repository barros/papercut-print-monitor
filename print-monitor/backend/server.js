var express = require('express');
var app = express();

const port = 5000;

app.get('/printers', (req, res) => {
  // fetch printers from db
});

app.get('/refresh', (req, res) => {
  // ping PaperCut API to update statuses then return updates
});

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Backend server listening at %s:%s", host, port)
})