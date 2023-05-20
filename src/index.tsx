import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import {BrowserRouter} from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const stripePromise =
loadStripe("pk_test_51N839nEq7epjm5ObHrsaD8yJWd0siCfxFzgVp7qmpJvR0pWHLbfzMG73K5N6l22GNGpw52HHZN4ltF0sVLaQ9VY900KxvhQZpS");
root.render(
  <BrowserRouter>
  <Elements stripe={stripePromise}>
  <App />
  </Elements>
  </BrowserRouter>
);
