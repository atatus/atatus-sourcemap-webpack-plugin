import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import atatus from './atatus';

window.atatus = atatus;

render(<App />, document.getElementById('root'));
