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
      selectedLocation: 0,
      loading: false
    });
    this.socket = socketIOClient(process.env.REACT_APP_API_DOMAIN, { secure: true });
    this.connectSocket();
  }

  componentDidMount(){
    this.fetchPrinters();
  }

  componentWillUnmount(){
    this.socket.close();
  }

  connectSocket = () => {
    this.socket.on('updated printers', (res) => {
      this.setState({ lastUpdate: res.lastUpdate });
      this.refreshPrinters(res.printers);
    });
    this.socket.on('locations', (res) => {
      this.setState({ locations: res.locations });
    });
  }

  fetchPrinters = () => {
    this.setState({ loading: true })
    this.socket.emit('get', (this.state.selectedLocation));
  }

  refreshPrinters = (printers) => {
    let updatedPrinters = [];
    printers.forEach(printer => {
      updatedPrinters.push(printer);
    });
    this.setState({ loading: false,
                    printers: updatedPrinters });
    const receivedPrinters = this.state.printers;
    console.log(`Last server update: ${this.state.lastUpdate}`);
    console.log('Received the following printers:');
    receivedPrinters.forEach(printer => {
      console.log(printer);
    });
  }

  handleRefresh = () => {
    this.setState({ printers: [], loading: true });
    this.socket.emit('refresh');
  };

  handleDropdownSelection = (prevSub, newSub) => {
    const subscriptionData = {
      prevSub: prevSub,
      newSub: newSub
    };
    this.setState({ printers: [], 
                    loading: true,
                    selectedLocation: newSub });
    this.socket.emit('sub change', (subscriptionData));
  }

  render(){
    let selectedLocation;
    if (this.state.locations){
      selectedLocation = this.state.locations[this.state.selectedLocation];
    }

    return (
      <div style={{flex: 1}}>
        <MonitorHead lastUpdate={this.state.lastUpdate} locations={this.state.locations} handleRefresh={this.handleRefresh} selectedLocation={this.state.selectedLocation} handleDropdownSelection={this.handleDropdownSelection}/>
        <Printers printers={this.state.printers} loading={this.state.loading} selectedLocation={selectedLocation}/>
      </div>
    );
  }
}

export default Monitor;