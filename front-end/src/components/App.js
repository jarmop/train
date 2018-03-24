import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import 'font-awesome/css/font-awesome.css';
import 'styles/App.css';
import ApiRace from 'components/ApiRace';
import Detail from 'components/Detail';
import Station from 'components/Station';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="container">
          <Route exact path="/" component={Home}/>
          <Route path="/station/:station(kannelmaki|huopalahti)" component={Station}/>
          <Route exact path="/:train" component={Train}/>
        </div>
    );
  }
}

export default App;

let Home = () => (
    <div>
      <Link to="/station/kannelmaki">Kannelmäki</Link>
      <br/>
      <Link to="/station/huopalahti">Huopalahti</Link>
    </div>
);

let Train = ({match}) => (
    <div>
      <Detail/>
      <ApiRace trainNumber={match.params.train} match={match}/>
    </div>
);