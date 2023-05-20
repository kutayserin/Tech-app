import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { Redirect, Route, Switch , useHistory} from 'react-router-dom';
import { oktaConfig } from './lib/oktaConfig';
import {OktaAuth, toRelativeUrl} from '@okta/okta-auth-js';
import {Security, LoginCallback, SecureRoute} from '@okta/okta-react';
import LoginWidget from './auth/LoginWidget';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';
import { ManageServicePage } from './layouts/ManageLibraryPage/ManageServicePage';
import { PaymentPage } from './layouts/PaymentPage/PaymentPage';
import { SearchProductsPage } from './layouts/SearchBooksPage/SearchProductsPage';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import { ProductCheckoutPage } from './layouts/BookCheckoutPage/ProductCheckoutPage';
import { CartPage } from './layouts/ShelfPage/CartPage';

const oktaAuth = new OktaAuth(oktaConfig)

export const App = () => {

  const customAuthHandler = () => {
    history.push('/login')
  }

  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };


  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>

   
    <Navbar />
    <div className='flex-grow-1'>
    <Switch>
    <Route path='/' exact>
    <Redirect to='/home'/>
    </Route>
    <Route path='/home'>
    <HomePage/>
    </Route>
    <Route path='/search'>
    <SearchProductsPage/>
    </Route>
    <Route path='/reviewList/:productId'>
      <ReviewListPage/>
    </Route>
    <Route path='/checkout/:productId'>
    <ProductCheckoutPage/>
    </Route>
    
    <Route path='/login' render={() => <LoginWidget config={oktaConfig}/>}/>

    <Route path='/login/callback' component={LoginCallback}/>
    <SecureRoute path='/cart'><CartPage/></SecureRoute>
    <SecureRoute path='/messages'><MessagesPage/></SecureRoute>
    <SecureRoute path='/admin'><ManageServicePage/></SecureRoute>
    <SecureRoute path='/fees'><PaymentPage /></SecureRoute>

    </Switch>

    </div>
    
    
    <Footer/>
    </Security>
    </div>
  );
}

