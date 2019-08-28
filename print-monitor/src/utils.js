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

function getBadge(dbStatus){
  const statuses = {
    'OK': 'ONLINE',
    'PAPER_JAM': 'ATTENTION',
    'PAPER_OUT': 'ATTENTION',
    'PAPER_PROBLEM': 'ATTENTION',
    'OUTPUT_BIN_FULL': 'ATTENTION',
    'NOT_AVAILABLE': 'UNAVAILABLE',
    'NO_TONER': 'ATTENTION',
    'OUT_OF_MEMORY': 'ATTENTION',
    'OFFLINE': 'OFFLINE',
    'DOOR_OPEN': 'ATTENTION',
    'USER_INTERVENTION': 'ATTENTION',
    'ERROR': 'ERROR',
    'UNKNOWN': 'UNKNOWN'
  };

  if (!statuses[dbStatus]){
    return 'UNKNOWN';
  }
  return statuses[dbStatus];
}

function getIconColor(badge){
  const badgeColors = {
    'ONLINE': '#35582e', // darkslategreen,
    'OFFLINE': '#c50000', // dark red
    'ATTENTION': '#c46512', // orange
    'UNAVAILABLE': '#c46512', // orange
    'UNKNOWN': '#c46512', // orange
    'ERROR': '#c50000' // dark red
  };
  
  if (!badgeColors[badge]){
    return 'black';
  }
  return badgeColors[badge];
}

module.exports = {
  getStatus: getStatus,
  getPrinterViewColor: getPrinterViewColor,
  getBadge: getBadge,
  getIconColor: getIconColor
}