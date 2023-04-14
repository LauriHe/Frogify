import {useState} from 'react';
import frogifyLogo from './assets/frogify.png';
import './App.scss';

function App() {
  return (
    <div className="App">
      <div>
        <img src={frogifyLogo} className="logo react" alt="Frogify logo" />
      </div>
    </div>
  );
}

export default App;
