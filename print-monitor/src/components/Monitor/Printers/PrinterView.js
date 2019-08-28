import React from 'react';
import Badge from './PrinterBadge';
import Check from '@material-ui/icons/Check';
import utils from '../../../utils';

class PrinterView extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    const badgeText = utils.getBadge(this.props.printer.status);

    let body = utils.getStatus(this.props.printer.status);
    let backgroundColor = utils.getPrinterViewColor(this.props.printer.status);
    let fontColor = (backgroundColor==='#c50000' ? 'white' : 'black');
    return (<div style={{position: 'relative', backgroundColor: '#f7f7f7', boxShadow: '2px 2px 15px #888888', width: '375px', height: 'auto', minHeight: '120px', marginBottom: '20px', paddingTop: '15px', paddingLeft: '15px', borderRadius:'10px'}}>
              <Badge text={badgeText} backgroundColor={backgroundColor} fontColor={fontColor} />
              <Check style={{right:10, position: 'absolute', fontSize: '35px', color: utils.getIconColor(badgeText)}}/>
              <div style={{fontSize: '13pt', marginBottom: '10px'}}>{this.props.printer.name}</div>
              <div style={{bottom:0, position: 'absolute', fontSize: '22pt'}}>{body}</div>
            </div>);
  }
}

export default PrinterView;