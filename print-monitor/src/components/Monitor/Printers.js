import React from 'react';
import { Spinner } from 'reactstrap';
import fetch from 'node-fetch';

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
    const PATH = `https://testpapercut.bc.edu/api/health/printers?Authorization=${process.env.REACT_APP_PAPERCUT_API_KEY}`
    const headers = {
      "Cache-Control": "no-cache",
      "Accept": "application/json"
    }
    fetch(PATH, { method: 'GET', 
                  headers: headers,
                  mode: 'cors'})
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        this.printerJSONtoState(json)
      })
      .catch((err) => {
        console.log("ERROR: "+err)
        setTimeout(() => {
          this.setState({ loading: false });
        }, 5000);
      })
  }

  printerJSONtoState = (data) => {
    console.log(data)
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
