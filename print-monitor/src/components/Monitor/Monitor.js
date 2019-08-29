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
      lastUpdate: undefined,
      printers: [],
      loading: false
    });
    this.socket = socketIOClient(process.env.REACT_APP_API_DOMAIN, { secure: true });
    this.connectSocket();
  }

  componentDidMount(){
    this.fetchPrinters();
  }

  fetchPrinters = () => {
    this.setState({ loading: true })
    this.socket.emit('get printers', (res) => {
      this.refreshPrinters(res.printer);
    });
    // this.setState({ loading: true });
    // // request the statuses from the backend
    // axios.get(apiPath)
    // .then(res => function(){
    //   console.log(res);
    //   // this.setState({ lastUpdate: res.data.lastUpdate });
    //   this.refreshPrinters(res.data);
    // })
    // .catch(err=>console.log(err));
  }

  connectSocket = () => {
    this.socket.on('updated printers', (res) => {
      this.setState({ lastUpdate: res.lastUpdate })
      this.refreshPrinters(res.printers);
    });
  }

  refreshPrinters = (printers) => {
    let updatedPrinters = [];
    printers.forEach(printer => {
      updatedPrinters.push(printer);
    });
    this.setState({ loading: false,
                    printers: updatedPrinters });
    const testPrinters = this.state.printers;
    console.log(`testing state.lastUpdate: ${this.state.lastUpdate}`)
    testPrinters.forEach(printer => {
      console.log(printer);
    });
  }

  handleRefresh = () => {
    this.setState({ printers: [], loading: true });
    this.socket.emit('refresh');
  };

  render(){
    return (
      <div>
        <MonitorHead lastUpdate={this.state.lastUpdate} handleRefresh={this.handleRefresh}/>
        <Printers printers={this.state.printers} loading={this.state.loading} />
      </div>
    );
  }
}

export default Monitor;