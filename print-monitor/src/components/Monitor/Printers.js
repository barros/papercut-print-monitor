import React from 'react';
import { Spinner } from 'reactstrap';
import axios from 'axios';
import utils from '../../utils';

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
