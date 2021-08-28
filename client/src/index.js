import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from 'react-router-dom'
import registerServiceWorker from "./registerServiceWorker";
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'

ReactDOM.render(<React.StrictMode>
    <Router>
      <App />
    </Router>
</React.StrictMode>, document.getElementById("root"));
registerServiceWorker();