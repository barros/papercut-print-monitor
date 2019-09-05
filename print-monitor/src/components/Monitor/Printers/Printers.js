import React from 'react';
import { Spinner } from 'reactstrap';
import PrinterView from './PrinterView';

class Printers extends React.Component {
  render() {
    let spinnerJSX;
    // List that will be updated with printer statuses
    let printerJSX = [];
    
    let locationDiv;
    if (this.props.selectedLocation){
      console.log(`location: ${this.props.selectedLocation}`)
      locationDiv = <h2 style={{fontFamily: 'Montserrat'}}>{this.props.selectedLocation.name} Printers</h2>
    }

    if (this.props.printers){
      this.props.printers.forEach(printer => {
        printerJSX.push(<PrinterView key={ printer._id } printer={ printer } style={{margin: 'auto', position: 'absolute'}} />);
      });
    }

    if (this.props.loading) {
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
