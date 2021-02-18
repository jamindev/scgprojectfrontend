import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Header from './components/header/header.js';
import SignIn from './components/body/auth/signin/signin.js'
import SignUp from './components/body/auth/signup/signup.js'
import Terms from './components/body/termsprivacy/terms.js'
import Privacy from './components/body/termsprivacy/privacy.js'
import Dashboard from './components/body/dashboard/dashboard.js';
import Flashcards from './components/body/flashcards/flashcards.js';
import ForgotPawword from './components/body/auth/signin/forgotpassword.js';
import PasswordSent from './components/body/auth/signin/passwordsent.js';
import Footer from './components/footer/footer.js';
import {Provider} from './context.js';

import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      
    }
  }


  render() { 
  return (
    <Provider>
    <div className="App">
      <Router>
      <Header />
        <Route exact path="/" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/flashcards" component={Flashcards} />
        <Route path="/forgotpassword" component={ForgotPawword} />
        <Route path="/passwordsent" component={PasswordSent} />
      <Footer />
      </Router>
    </div>
    </Provider>
  );
  }
}

export default App;
