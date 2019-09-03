import React from 'react';
import { Jumbotron, Button, Alert, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class MonitorHead extends React.Component {
  constructor(props){
    super(props);
    this.state = ({ lastUpdate: null,
                    dropdownOpen: false,
                    currentLocation: null,
                    dropdownItemPressed: null,
                    dropdownValue: 'Select Location' });
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.lastUpdate !== this.props.lastUpdate) {
      this.setState({ lastUpdate: nextProps.lastUpdate });
    }
  }

  toggle = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  select = (event) => {
    const prevSub = this.state.currentLocation;
    const newSub = event.target.id;
    this.setState({ dropdownValue: event.target.innerText,
                    currentLocation: newSub });
    this.props.handleDropdownSelection(prevSub, newSub);
  }

  isOptionDisabled = (id) => {
    return (id === this.state.currentLocation);
  }

  render(){
    let lastUpdateJSX;
    if (this.state.lastUpdate){
      var lastUpdateText = new Date(this.state.lastUpdate).toLocaleString()
      lastUpdateJSX = <Alert color='primary'>Last Updated at: <strong>{lastUpdateText}</strong></Alert>;
    }

    return (
      <Jumbotron style={{textAlign: "center", paddingTop: "20px", paddingBottom: "15px"}}>
        <h1 className="display-4">PaperCut Print Monitor</h1>
        <p className="lead">Below is the status of the PaperCut Release Station printers</p>
        <hr className="my-2" />
        <Button onClick={this.props.handleRefresh} color="primary" style={{marginTop: "15px"}}>Refresh Monitor</Button>
        <div style={{marginTop: '5px', marginBottom: '10px'}}>
          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>{this.state.dropdownValue}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Locations</DropdownItem>
              <DropdownItem divider />
              <DropdownItem id={0} onClick={this.select}>All Locations</DropdownItem>
              <DropdownItem id={1} onClick={this.select}>O'Neill Library</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        {lastUpdateJSX}
      </Jumbotron>
    );
  }
}

export default MonitorHead;