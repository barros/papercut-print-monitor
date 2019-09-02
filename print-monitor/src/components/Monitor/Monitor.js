import dotenv from 'dotenv';
import React from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

import MonitorHead from "./MonitorHead";
import Printers from "./Printers/Printers";

dotenv.config();

var apiPath = `${process.env.REACT_APP_API_DOMAIN}/printers`

class Monitor extends React.Component {
  constructor(props){
    super(props);
    this.state = ({
      lastUpdate: null,
      printers: [],
      loading: false,
      selectedLocation: 0
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
      this.setState({ lastUpdate: res.lastUpdate })
      this.refreshPrinters(res.printers);
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
    const testPrinters = this.state.printers;
    console.log(`Last server update: ${this.state.lastUpdate}`)
    testPrinters.forEach(printer => {
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
    return (
      <div>
        <MonitorHead lastUpdate={this.state.lastUpdate} handleRefresh={this.handleRefresh} selectedLocation={this.state.selectedLocation} handleDropdownSelection={this.handleDropdownSelection}/>
        <Printers printers={this.state.printers} loading={this.state.loading} selectedLocation={this.state.selectedLocation}/>
      </div>
    );
  }
}

export default Monitor;