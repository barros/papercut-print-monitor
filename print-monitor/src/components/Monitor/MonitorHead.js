import React from 'react';
import { Jumbotron, Button, Alert, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class MonitorHead extends React.Component {
  constructor(props){
    super(props);
    this.state = ({ dropdownOpen: false });
  }

  toggle = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  select = (event) => {
    const prevLocID = this.props.selectedLocationID;
    const newLocID = event.target.id;
    this.setState({ dropdownValue: event.target.innerText,
                    currentLocationID: newLocID });
    this.props.handleDropdownSelection(prevLocID, newLocID);
  }

  render(){
    let lastUpdateJSX;
    if (this.props.lastUpdate){
      var lastUpdateText = new Date(this.props.lastUpdate).toLocaleString();
      lastUpdateJSX = <Alert color='primary'>Last Updated at: <strong>{lastUpdateText}</strong></Alert>;
    }

    let dropdownItems = [];
    // Current location to be displayed as dropdown value
    let dropdownValue;
    if (this.props.locations){
      let currentLocation = this.props.locations[this.props.selectedLocationID]
      dropdownValue = currentLocation.dropdownText;

      this.props.locations.forEach((location, index) => {
        dropdownItems.push(
          <DropdownItem key={index} id={index} onClick={this.select}>{location.dropdownText}</DropdownItem>
        );
      });
    }

    return (
      <Jumbotron style={{textAlign: "center", paddingTop: "20px", paddingBottom: "15px"}}>
        <h1 className="display-4" style={{fontFamily: 'Montserrat'}}>PaperCut Print Monitor</h1>
        <p className="lead">Below are the statuses of the PaperCut Release Station printers</p>
        <hr className="my-2" />
        <Button onClick={this.props.handleRefresh} color="primary" style={{marginTop: "15px", fontFamily: 'Raleway', fontWeight: 'bold'}}>Refresh Monitor</Button>
        <div style={{marginTop: '5px', marginBottom: '10px'}}>
          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} style={{fontFamily: 'Raleway'}}>
            <DropdownToggle caret>{dropdownValue}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Locations</DropdownItem>
              <DropdownItem divider />
              {dropdownItems}
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        {lastUpdateJSX}
      </Jumbotron>
    );
  }
}

export default MonitorHead;