import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { UserProvider } from './context/UserContext';
import { FeedProvider } from './context/FeedContext';
import { ThemeProvider } from './context/ThemeContext';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux"
import { store } from './Redux/store'

ReactDOM.render(
<React.StrictMode>
    <ThemeProvider>
      <UserProvider>
        <FeedProvider>
          <App />
        </FeedProvider>
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>,
  // <React.StrictMode>
  //   <Provider store={store}>
  //     <BrowserRouter>
  //       <App />
  //     </BrowserRouter>
  //   </Provider>
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

