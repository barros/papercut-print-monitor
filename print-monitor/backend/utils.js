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

module.exports = {
  getBadge: getBadge
}