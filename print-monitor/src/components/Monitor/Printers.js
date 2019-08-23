import dotenv from 'dotenv';
import React from 'react';
import { Spinner } from 'reactstrap';
import axios from 'axios';

// Allow access to environment variables
dotenv.config()

// Hide development IP when pushing to git
var path = `${process.env.REACT_APP_API_URL}/printers`

class Printers extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      printers: [],
      loading: false
    });
  }
  componentDidMount() {
    this.fetchPrinters()
  }

  fetchPrinters = () => {
    this.setState({ loading: true })
    // request the statuses from the backend
    axios.get(path)
    .then(res=>this.refreshPrinters(res.data))
    .catch(err=>console.log(err));
  }

  refreshPrinters = (printers) => {
    let updatedPrinters = [];
    printers.forEach(printer => {
      updatedPrinters.push(printer);
    });
    this.setState({ loading: false,
                    printers: updatedPrinters });
    // const testPrinters = this.state.printers;
    // testPrinters.forEach(printer => {
    //   console.log(printer.name);
    // });

  }

  render() {
    let spinnerJSX;
    // List that will be updated with printer statuses
    let printerJSX = [];
    if (this.state.printers){
      this.state.printers.forEach(printer => {
        console.log(printer.name);
        printerJSX.push(<div key={printer.id}>
          {printer.name} -- {printer.status}
        </div>);
      });
      console.log(`printerJSX size = ${printerJSX.length}`)
    }
    if (this.state.loading) {
      spinnerJSX = <Spinner color="info"/>
    } else {
      spinnerJSX = ""
    }
    return (
      <div style={{paddingBottom:"20px"}}>
        <div style={{textAlign: "center"}}>
          {spinnerJSX}
          {printerJSX}
        </div>
      </div>
    );
  }
}

export default Printers;
