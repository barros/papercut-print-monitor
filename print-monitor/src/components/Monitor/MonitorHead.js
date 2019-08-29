import React from 'react';
import { Jumbotron, Button, Alert } from 'reactstrap';

class MonitorHead extends React.Component {
constructor(props){
  super(props);
  this.state = ({ lastUpdate: undefined });
}

componentWillReceiveProps(nextProps){
  if (nextProps.lastUpdate !== this.props.lastUpdate) {
    this.setState({ lastUpdate: nextProps.lastUpdate })
  }
}

render(){
  let lastUpdateJSX;
  if (this.state.lastUpdate){
    lastUpdateJSX = <Alert color='primary'>Last Updated at: {this.state.lastUpdate}</Alert>;
  }

  return (
    <Jumbotron style={{textAlign: "center", paddingTop: "20px", paddingBottom: "15px"}}>
      <h1 className="display-4">PaperCut Print Monitor</h1>
      <p className="lead">Below is the status of the PaperCut Release Station printers</p>
      <hr className="my-2" />
      <p >
          <Button onClick={this.props.handleRefresh} color="primary" style={{marginTop: "15px"}}>Refresh Monitor</Button>
      </p>
      {lastUpdateJSX}
    </Jumbotron>
  );
}
}

export default MonitorHead;