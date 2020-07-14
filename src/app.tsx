import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Stats from './routes/stats';


const App = () => {
    return <Router>
        <div className="viewport">
            <Switch>
                <Route path="/stats/:stat" component={Stats}/>
                <Route path="*" component={Stats} />
            </Switch>
        </div>
    </Router>
}

export default App;
