function getStatus(dbStatus){
  const statuses = {
    'OK': 'All good',
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

function getBadgeColor(badge){
  const badgeColors = {
    'ONLINE': '#9dff89', // check mark, light green
    'OFFLINE': '#c50000', // (!) exclamation mark icon, dark red
    'ATTENTION': '#c50000', // (i) info icon, dark red
    'UNAVAILABLE': '#c46512', // (?) question mark icon, orange
    'UNKNOWN': '#c46512', // (?) question mark icon, orange
    'ERROR': '#c50000' // (!) exclamation mark icon, dark red
  };
  
  if (!badgeColors[badge]){
    return 'black';
  }
  return badgeColors[badge];
}

function getIconColor(badge){
  const badgeColors = {
    'ONLINE': '#35582e', // check mark, darkslategreen
    'OFFLINE': '#c50000', // (!) exclamation mark icon, dark red
    'ATTENTION': '#c50000', // (i) info icon, dark red
    'UNAVAILABLE': '#c46512', // (?) question mark icon, orange
    'UNKNOWN': '#c46512', // (?) question mark icon, orange
    'ERROR': '#c50000' // (!) exclamation mark icon, dark red
  };
  
  if (!badgeColors[badge]){
    return 'black';
  }
  return badgeColors[badge];
}

module.exports = {
  getStatus: getStatus,
  getBadgeColor: getBadgeColor,
  getIconColor: getIconColor
}