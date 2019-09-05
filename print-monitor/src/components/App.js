import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Monitor from './Monitor/Monitor';
import BugReportIcon from '@material-ui/icons/BugReport';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div style={{display: 'flex', minHeight: '100vh', flexDirection: 'column'}}>
      <Header />
      <Monitor />
      <Footer />
    </div>
  );
}

export default App;
