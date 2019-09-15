import React from 'react'
import Home from './home'
import Login from './login'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Main() {
    return(
        <div>
            <Router>
                <Route exact path='/' component={Login}/>
                <Route path='/home' component={Home}/>
            </Router>
        </div>
    )
}
  
  export default Main