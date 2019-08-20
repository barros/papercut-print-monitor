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
    // request the statuses from the backend
    axios.get(path)
    .then(res=>console.log(res.data))
    .catch(err=>console.log(err));
  }

  render() {
    let spinnerJSX;
    if (this.state.loading) {
      spinnerJSX = <Spinner color="info"/>
    } else {
      spinnerJSX = ""
    }
    return (
      <div style={{paddingBottom:"20px"}}>
        <div style={{textAlign: "center"}}>
          {spinnerJSX}
        </div>
      </div>
    );
  }
}

export default Printers;
