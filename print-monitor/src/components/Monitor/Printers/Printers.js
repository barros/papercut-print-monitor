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
        printerJSX.push(
                        <div key={printer._id}>
                          <PrinterView printer={printer} />
                        </div>
        );
      });
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
