import React from "react";
import App from "./App.jsx";
import "./style.scss"

import {Router, Route, Link} from "react-router";
import HashHistory from 'react-router/lib/HashHistory'


React.render((
    <Router history={new HashHistory()}>
        <Route path="/" component={App}>
        </Route>
    </Router>
), document.body);
