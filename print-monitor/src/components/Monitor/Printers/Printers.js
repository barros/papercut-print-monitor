import React from 'react';
import Loader from 'react-spinners/GridLoader';
import PrinterView from './PrinterView';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import '../../../Presentational/printers.css';

class Printers extends React.Component {
  render() {
    // List that will be updated with printer statuses
    let printerList = [];
    if (this.props.printers){
      this.props.printers.forEach(printer => {
        printerList.push(<PrinterView key={ printer._id } printer={ printer } style={{margin: 'auto', position: 'absolute'}} />);
      });
    }
    
    let locationDiv;
    if (this.props.selectedLocation){
      locationDiv = <div>
                      <h2 style={{fontFamily: 'Montserrat'}}>{this.props.selectedLocation.name} Printers</h2>
                      <hr className="my-2" style={{paddingBottom:'25px'}}/>
                    </div>;
    }
    
    return (
      <div style={{position: 'relative', marginTop: '10px', paddingBottom: '20px', marginLeft: '30px', marginRight: '30px', textAlign: 'center'}}>
        {locationDiv}
        <div>
          <Loader css={'display: block; margin: 0 auto; border-color: red;'} color={'#a26864'} margin={'3px'} loading={this.props.loading} />
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={800}
            transitionLeaveTimeout={50}
            style={{ display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around', 
                    textAlign: 'left' }}>
            {printerList}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

export default Printers;
