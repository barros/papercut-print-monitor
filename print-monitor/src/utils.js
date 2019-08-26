function getStatus(dbStatus){
  const statuses = {
    'OK': 'All good!',
    'PAPER_JAM': 'Paper Jam!',
    'PAPER_OUT': 'Out of Paper!',
    'PAPER_PROBLEM': 'There\'s a paper problem',
    'OUTPUT_BIN_FULL': 'Paper bin is full',
    'NOT_AVAILABLE': 'Status is unavailable',
    'NO_TONER': 'Replace toner!',
    'OUT_OF_MEMORY': 'Printer is out of memory',
    'OFFLINE': 'Printer is offline!',
    'DOOR_OPEN': 'Door is open',
    'USER_INTERVENTION': 'User intervention',
    'ERROR': 'Printer error',
    'UNKNOWN': 'Status is unknown'
  };

  if (!statuses[dbStatus]){
    return 'Unknown';
  }

  return statuses[dbStatus];
}

function getPrinterViewColor(dbStatus){
  const statuses = {
    'OK': '#9dff89', // green
    'PAPER_JAM': '#c50000', // red
    'PAPER_OUT': '#c50000',
    'PAPER_PROBLEM': '#c50000',
    'OUTPUT_BIN_FULL': '#c50000',
    'NOT_AVAILABLE': '#ffd83d', // orange
    'NO_TONER': '#c50000',
    'OUT_OF_MEMORY': '#c50000',
    'OFFLINE': '#c50000',
    'DOOR_OPEN': '#c50000',
    'USER_INTERVENTION': '#c50000',
    'ERROR': '#c50000',
    'UNKNOWN': '#ffd83d'
  };

  if (!statuses[dbStatus]){
    return 'white';
  }

  return statuses[dbStatus];
}

module.exports = {
  getStatus: getStatus,
  getPrinterViewColor: getPrinterViewColor
}