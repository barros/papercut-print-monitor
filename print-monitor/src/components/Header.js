import React from 'react';
import logo from './../logo-white.png';

function Header() {
  return (<nav class="navbar navbar-expand-lg" style={{ position: 'relative', backgroundColor: '#521b17' }}>
      <span class="navbar-brand" style={{ color: 'white', fontSize: '25pt', fontFamily: 'Montserrat' }}>EAGLETECH</span>
      <img style={{position: 'absolute', right: 10, width: '50px', height: '35px', marginLeft: '-5px'}} src={logo} alt="EagleTech"/>
    </nav>);
}

export default Header;