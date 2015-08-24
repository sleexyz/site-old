import React from "react";
import "./style.scss"

import {Router, Route, Link} from "react-router";
import HashHistory from 'react-router/lib/HashHistory'

import Landing from "./Landing.jsx";
import App from "./App.jsx";

React.render((
    <Router history={new HashHistory()}>
        <Route path="/" component={App}
               indexRoute={{component: Landing}}>
        </Route>
    </Router>
), document.body);
