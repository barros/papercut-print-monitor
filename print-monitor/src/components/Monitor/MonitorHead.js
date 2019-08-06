import React from 'react';
import { Jumbotron, Button } from 'reactstrap';

function MonitorHead() {
  return (
    <Jumbotron style={{textAlign: "center", paddingTop: "20px", paddingBottom: "15px"}}>
      <h1 className="display-4">PaperCut Print Monitor</h1>
      <p className="lead">Below is the status of the PaperCut Release Station printers</p>
      <hr className="my-2" />
      <p >
          <Button color="primary" style={{marginTop: "15px"}}>Refresh Monitor</Button>
      </p>
    </Jumbotron>
  );
}

export default MonitorHead;