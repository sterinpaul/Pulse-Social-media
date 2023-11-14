
// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store.ts'
import { ThemeProvider } from "@material-tailwind/react";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <Provider store={store}>
        <ThemeProvider>
          <ToastContainer position="top-right" hideProgressBar={true} pauseOnFocusLoss={false} autoClose={2000} />
            <App />
        </ThemeProvider>
    </Provider>
  // </React.StrictMode>
)
