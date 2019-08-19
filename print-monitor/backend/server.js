var express = require('express');
var axios = require('axios');
var app = express();

const port = 5000;

var printers = {};

app.get('/printers', (req, res) => {
  // fetch printers from db
});

app.get('/refresh', (req, res) => {
  // ping PaperCut API to update statuses then return updates
  console.log('refreshing printers');
});

// fetchPrinters = (res) => {
//   const url = "https://testpapercut.bc.edu/api/health/printers";
//   const headerConfig = {
//     headers: { "Authorization": "ll6ByDKqhYSkOvzIhmh4Yl7HlerBlbTc" }
//   };
//   axios.get(url, headerConfig)
//   .then(data => res.send(data))
//   .catch(err=>console.log(err));
// }

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  const url = "https://testpapercut.bc.edu/api/health/printers";
  const headerConfig = {
    headers: { "Authorization": "ll6ByDKqhYSkOvzIhmh4Yl7HlerBlbTc" }
  };

  axios.get(url, headerConfig)
  .then(res => addPrinters(res.data))
  .catch(err=>console.log(err));
  
  console.log("Backend server listening at %s:%s", host, port);
})

addPrinters = (data) => {
  for (printer in data.printers){
    name = printer.name;
    printers[name] = printer;
  }
  console.log(printers);
}