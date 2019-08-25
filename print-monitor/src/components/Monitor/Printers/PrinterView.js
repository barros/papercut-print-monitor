import React from 'react';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';
import utils from '../../../utils';

class PrinterView extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    let body;
    body = utils.getStatus(this.props.printer.status);
    return (<Toast>
              <ToastHeader>{this.props.printer.name}</ToastHeader>
              <ToastBody>{body}</ToastBody>
            </Toast>)
  }
}

export default PrinterView;