import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'typeface-roboto';

if (process.env.NODE_ENV !== 'production') {
  localStorage.setItem('debug', 'make-my-week:*');
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
