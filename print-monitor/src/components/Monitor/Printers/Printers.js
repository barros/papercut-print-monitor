import React from 'react';
import { Spinner } from 'reactstrap';
import PrinterView from './PrinterView';

import utils from '../../../utils';

class Printers extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      printers: [],
      loading: false
    });
  }
  
  componentWillReceiveProps(nextProps){
    if (nextProps !== this.props) {
      this.setState({ printers: nextProps.printers,
                      loading: nextProps.loading });
    }
  }

  render() {
    let spinnerJSX;
    // List that will be updated with printer statuses
    let printerJSX = [];
    let locationDiv = <h2>{utils.getFullLocation(this.props.selectedLocation)}</h2>
    if (this.state.printers){
      this.state.printers.forEach(printer => {
        printerJSX.push(<PrinterView key={ printer._id } printer={ printer } style={{margin: 'auto', position: 'absolute'}} />);
      });
    }
    if (this.state.loading) {
      spinnerJSX = <Spinner color="info"/>
    } else {
      spinnerJSX = ""
    }
    return (
      <div style={{position: 'relative', marginTop: '10px', paddingBottom: '20px', marginLeft: '30px', marginRight: '30px', textAlign: 'center'}}>
        {locationDiv}
        <hr className="my-2" style={{paddingBottom:'25px'}}/>
        <div>
          {spinnerJSX}
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', textAlign: 'left'}}>{printerJSX}</div>
        </div>
      </div>
    );
  }
}

export default Printers;
