import React from 'react';
import '../presentational/Header.css';

var headerStyle = {
  'paddingLeft': '20px',
  'backgroundColor': '#521b17',
  'minHeight': '10vh',
  'display': 'flex',
  'justifyContent': 'center',
  'alignContent': 'center',
  'flexDirection': 'column',
  'color': 'white',
}

function Header() {
  return (<nav class="navbar navbar-expand-lg" style={{ backgroundColor: '#521b17' }}>
      <h1 class="navbar-brand" style={{ color: 'white', fontSize: '25pt', fontFamily: 'Montserrat' }}>EAGLETECH</h1>
    </nav>);
}

export default Header;