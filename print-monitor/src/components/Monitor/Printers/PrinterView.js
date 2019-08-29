import React from 'react';
import Badge from './PrinterBadge';
import Check from '@material-ui/icons/Check';
import Help from '@material-ui/icons/Help';
import Error from '@material-ui/icons/Error';
import utils from '../../../utils';

class PrinterView extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    var iconJSX;
    const badgeText = utils.getBadge(this.props.printer.status);
    var style = { 
                  right:10,
                  position: 'absolute', 
                  fontSize: '35px', 
                  color: utils.getIconColor(badgeText)
                };
    if (badgeText==='ONLINE'){
      iconJSX = <Check style={style}/>
    } else if (badgeText==='UNAVAILABLE' || badgeText==='UNKNOWN'){
      iconJSX = <Help style={style}/>
    } else {
      iconJSX = <Error style={style}/>
    }

    let body = utils.getStatus(this.props.printer.status);
    let backgroundColor = utils.getBadgeColor(badgeText);
    let fontColor = ((backgroundColor==='#c50000' || backgroundColor==='#c46512') ? 'white' : 'black');
    
    return (<div style={{position: 'relative', backgroundColor: '#f7f7f7', boxShadow: '2px 2px 15px #888888', width: '375px', minWidth: '290px', height: 'auto', minHeight: '120px', marginBottom: '20px', paddingTop: '13px', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '5px', borderRadius:'10px'}}>
              <div style={{marginBottom: '5px'}}>
                <Badge text={badgeText} backgroundColor={backgroundColor} fontColor={fontColor} />
                {iconJSX}
              </div>
              <div style={{fontSize: '13pt'}}>{this.props.printer.name}</div>
              <div style={{bottom: 0, right: 5, paddingTop: '5px', fontSize: '22pt', lineHeight: '30px'}}>{body}</div>
            </div>);
  }
}

export default PrinterView;