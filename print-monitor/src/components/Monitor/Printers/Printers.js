import React from 'react';
import { Spinner } from 'reactstrap';
import PrinterView from './PrinterView';

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
      <div style={{position: 'relative', paddingBottom:"20px", marginLeft: '30px', marginRight: '30px'}}>
        <div>
          {spinnerJSX}
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>{printerJSX}</div>
        </div>
      </div>
    );
  }
}

export default Printers;
