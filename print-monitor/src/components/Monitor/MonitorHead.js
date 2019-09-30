import React from 'react';
import { Jumbotron, Button, Alert, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class MonitorHead extends React.Component {
  constructor(props){
    super(props);
    this.state = ({ locationDropdownOpen: false,
                    filterDropdownOpen: false });
  }

  toggleLocation = () => {
    this.setState({ locationDropdownOpen: !this.state.locationDropdownOpen });
  };

  toggleFilter = () => {
    this.setState({ filterDropdownOpen: !this.state.filterDropdownOpen });
  };

  selectLocation = (event) => {
    const prevLocID = this.props.selectedLocationID;
    const newLocID = event.target.id;
    this.setState({ locDropdownValue: event.target.innerText,
                    currentLocationID: newLocID });
    this.props.handleLocationChange(prevLocID, newLocID);
  }

  selectFilter = (event) => {
    this.props.handleFilterChange(event.target.innerText);

  }

  render(){
    let lastUpdateJSX;
    if (this.props.lastUpdate){
      var lastUpdateText = new Date(this.props.lastUpdate).toLocaleString();
      lastUpdateJSX = <Alert color='primary'>Last Updated at: <strong>{lastUpdateText}</strong></Alert>;
    }

    let dropdownItems = [];
    // Current location to be displayed as dropdown value
    let locDropdownValue;
    if (this.props.locations){
      let currentLocation = this.props.locations[this.props.selectedLocationID]
      locDropdownValue = currentLocation.dropdownText;

      this.props.locations.forEach((location, index) => {
        dropdownItems.push(
          <DropdownItem key={index} id={index} onClick={this.selectLocation}>{location.dropdownText}</DropdownItem>
        );
      });
    }

    return (
      <Jumbotron style={{textAlign: "center", paddingTop: "20px", paddingBottom: "15px"}}>
        <h1 className="display-4" style={{fontFamily: 'Montserrat'}}>PaperCut Print Monitor</h1>
        <p className="lead">Below are the statuses of the PaperCut Release Station printers</p>
        <hr className="my-2" />
        <Button onClick={this.props.handleRefresh} color="primary" style={{marginTop: "15px", fontFamily: 'Raleway', fontWeight: 'bold'}}>Refresh Monitor</Button>
        {/* Location dropdown menu below */}
        <div style={{marginTop: '5px', marginBottom: '5px'}}>
          <ButtonDropdown isOpen={this.state.locationDropdownOpen} toggle={this.toggleLocation} style={{fontFamily: 'Raleway'}}>
            <DropdownToggle caret>{locDropdownValue}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Locations</DropdownItem>
              <DropdownItem divider />
              {dropdownItems}
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        {/* Status filter dropdown menu below */}
        <div style={{marginTop: '5px', marginBottom: '10px'}}>
          <ButtonDropdown isOpen={this.state.filterDropdownOpen} toggle={this.toggleFilter} style={{fontFamily: 'Raleway'}}>
            <DropdownToggle caret>{this.props.filter}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Filters</DropdownItem>
              <DropdownItem divider />
              <DropdownItem key={0} onClick={this.selectFilter}>All Statuses</DropdownItem>
              <DropdownItem key={1} onClick={this.selectFilter}>Online</DropdownItem>
              <DropdownItem key={2} onClick={this.selectFilter}>Needs Attention</DropdownItem>
              <DropdownItem key={3} onClick={this.selectFilter}>Error</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        {lastUpdateJSX}
      </Jumbotron>
    );
  }
}

export default MonitorHead;