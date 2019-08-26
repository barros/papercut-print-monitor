import React from 'react';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';
import utils from '../../../utils';

class PrinterView extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    let body = utils.getStatus(this.props.printer.status);
    let backgroundColor = utils.getPrinterViewColor(this.props.printer.status);
    let fontColor = (backgroundColor==='#c50000' ? 'white' : 'black');
    return (<Toast style={{ backgroundColor: backgroundColor, marginBottom: '20px' }}>
              <ToastHeader style={{fontSize: '17px'}}>{this.props.printer.name}</ToastHeader>
              <ToastBody style={{fontSize: '15px', color: fontColor}}>{body}</ToastBody>
            </Toast>);
  }
}

export default PrinterView;