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
    const receivedPrinters = this.state.printers;
    console.log(`Last server update: ${this.state.lastUpdate}`);
    console.log(`Received the following printers from location - (${this.state.locations[locationID].name}):`);
    receivedPrinters.forEach(printer => {
      console.log(printer);
    });
  }

  handleRefresh = () => {
    this.setState({ printers: [], loading: true });
    this.socket.emit('refresh');
  };

  handleSubscriptionChange = (prevLocID, newLocID) => {
    const subscriptionData = {
      prevSub: prevLocID,
      newSub: newLocID
    };
    this.setState({ printers: [], 
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
        <MonitorHead lastUpdate={this.state.lastUpdate} locations={this.state.locations} handleRefresh={this.handleRefresh} selectedLocationID={this.state.currentLocation} handleDropdownSelection={this.handleSubscriptionChange}/>
        <Printers printers={this.state.printers} loading={this.state.loading} currentLocation={currentLocation}/>
      </div>
    );
  }
}

export default Monitor;