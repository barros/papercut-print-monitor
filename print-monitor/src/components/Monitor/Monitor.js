import dotenv from 'dotenv';
import React from 'react';
import socketIOClient from 'socket.io-client';

import MonitorHead from "./MonitorHead";
import Printers from "./Printers/Printers";

dotenv.config();

class Monitor extends React.Component {
  constructor(props){
    super(props);
    this.state = ({
      lastUpdate: null,
      printers: [],
      filter: 'All Statuses',
      filteredPrinters: [],
      locations: null,
      currentLocation: 0,
      loading: false
    });
    this.socket = socketIOClient(process.env.REACT_APP_API_DOMAIN, { secure: true });
  }

  componentWillMount(){
    this.connectSocket();
  }

  componentDidMount(){
    this.fetchPrinters();
  }

  componentWillUnmount(){
    this.socket.close();
  }

  // Configure and set socket client endpoints
  connectSocket = () => {
    this.socket.on('updated printers', (res) => {
      this.setState({ lastUpdate: res.lastUpdate });
      this.refreshPrinters(res.locationID, res.printers);
    });
    this.socket.on('locations', (res) => {
      this.setState({ locations: res.locations });
    });
  }

  // Fetching & refreshing printer methods
  fetchPrinters = () => {
    this.setState({ loading: true })
    this.socket.emit('get', (this.state.currentLocation));
  }

  refreshPrinters = (locationID, printers) => {
    let updatedPrinters = [];
    printers.forEach(printer => {
      updatedPrinters.push(printer);
    });
    this.setState({ loading: false,
                    printers: updatedPrinters,
                    currentLocation: locationID });
    this.filterPrinters(this.state.filter);
    console.log(`Last server update: ${this.state.lastUpdate}`);
    console.log(`Received the following printers from location - (${this.state.locations[locationID].name}):`);
    // receivedPrinters.forEach(printer => {
    //   console.log(printer);
    // });
  }

  filterPrinters = (filter) => {
    this.setState({ loading: false, filterPrinters: [] });
    let filteredArr = [];
    switch (filter){
      case 'All Statuses': {
        this.setState({ filteredPrinters: this.state.printers });
        break;
      }
      case 'Online': {
        filteredArr = this.state.printers.filter(printer => {
          return printer.badge==='ONLINE';
        });
        this.setState({ filteredPrinters: filteredArr });
        break;
      }
      case 'Needs Attention': {
        filteredArr = this.state.printers.filter(printer => {
          return printer.badge==='OFFLINE' || printer.badge==='ATTENTION' || printer.badge==='UNAVAILABLE' || printer.badge==='UNKNOWN';
        });
        this.setState({ filteredPrinters: filteredArr });
        break;
      }
      case 'Error': {
        filteredArr = this.state.printers.filter(printer => {
          return printer.badge==='ERROR';
        });
        this.setState({ filteredPrinters: filteredArr });
        break;
      }
      default: {
        break;
      }
    }
    this.setState({ loading: false });
  }

  handleFilterChange = (appliedFilter) => {
    this.setState({ filter: appliedFilter });
    this.filterPrinters(appliedFilter);
  }

  handleRefresh = () => {
    this.setState({ printers: [], filteredPrinters: [], loading: true });
    this.socket.emit('refresh');
  };

  handleSubscriptionChange = (prevLocID, newLocID) => {
    const subscriptionData = {
      prevSub: prevLocID,
      newSub: newLocID
    };
    this.setState({ printers: [], 
                    filteredPrinters: [],
                    loading: true,
                    currentLocation: newLocID });
    this.socket.emit('subscription change', (subscriptionData));
  }

  render(){
    let currentLocation;
    if (this.state.locations){
      currentLocation = this.state.locations[this.state.currentLocation];
    }

    return (
      <div style={{flex: 1}}>
        <MonitorHead lastUpdate={this.state.lastUpdate} locations={this.state.locations} handleRefresh={this.handleRefresh} handleFilterChange={this.handleFilterChange} filter={this.state.filter} selectedLocationID={this.state.currentLocation} handleLocationChange={this.handleSubscriptionChange}/>
        <Printers printers={this.state.filteredPrinters} loading={this.state.loading} currentLocation={currentLocation} loading={this.state.loading}/>
      </div>
    );
  }
}

export default Monitor;