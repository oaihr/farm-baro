import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import './styles/global.css';
import './styles/utilities.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store, persistor } from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

// 개발 환경에서는 PersistGate 사용하지 않음
const isDevelopment = process.env.NODE_ENV === 'development';

const AppWithProvider = () => (
  <Provider store={store}>
    {isDevelopment ? (
      <App />
    ) : (
      <PersistGate loading={<div>로딩 중...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    )}
  </Provider>
);

root.render(
  <React.StrictMode>
    <AppWithProvider />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
