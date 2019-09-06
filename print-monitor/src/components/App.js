import React from 'react';
import Header from './Header';
import Monitor from './Monitor/Monitor';
import ReportBug from './ReportBugModal';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = ({ reportBug: false });
  }

  toggleBugModal = () => {
    this.setState({ reportBug: !this.state.reportBug })
  }

  render(){
    return (
      <div style={{display: 'flex', minHeight: '100vh', flexDirection: 'column'}}>
        <Header />
        <Monitor />
        <ReportBug reportBug={this.state.reportBug} toggleBugModal={this.toggleBugModal}/>
        <Footer toggleBugModal={this.toggleBugModal} />
      </div>
    );
  }
}

export default App;
