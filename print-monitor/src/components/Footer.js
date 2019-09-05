import React from 'react';
import logo from '../logo-white.png';
import BugReportIcon from '@material-ui/icons/BugReport';

function Footer() {
  return(<footer class="page-footer font-small" style={{backgroundColor: '#521b17'}}>
            <div class="footer-copyright text-center py-2" style={{color: 'white', position: 'relative'}}>
              ©2019, <a href="http://barrospena.com" target="_blank" rel="noopener noreferrer" style={{color: 'white'}}>Jeffrey Barros Peña</a>
              <img style={{width: '35px', height: '25px'}} src={logo} alt="EagleTech"/>
              <BugReportIcon style={{right:10, position: 'absolute'}} />
            </div>
          </footer>);
}

export default Footer;