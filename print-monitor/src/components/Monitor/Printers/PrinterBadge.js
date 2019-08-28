import React from 'react';

class PrinterBadge extends React.Component {
  render(){
    return <div style={{backgroundColor: this.props.backgroundColor, display: 'inline-block', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '10px', paddingRight: '10px', color: this.props.fontColor, fontSize: '10pt', fontWeight: 'bold', borderRadius: '5px'}}>{this.props.text}</div>
  }
}

export default PrinterBadge;