import React from 'react';
import ReactDOM from 'react-dom';
import serviceWorker from './serviceworker';

import App from './App';

ReactDOM.render(<App />, document.querySelector('#root'));

serviceWorker();
