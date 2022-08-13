import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';

import './index.css';
import store from './store/index';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
