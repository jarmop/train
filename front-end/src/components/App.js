import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import 'font-awesome/css/font-awesome.css';
import 'styles/App.css';
import ApiRace from 'components/ApiRace';
import Detail from 'components/Detail';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="container">
          <header>erwfew</header>
          <Route exact path="/" component={Home}/>
          <Route path="/:train" component={Train}/>
        </div>
    );
  }
}

export default App;

let Home = () => (
    <div>
      Kannelmäen junat
    </div>
);

let Train = ({match}) => (
    <div>
      <Detail/>
      <ApiRace trainNumber={match.params.train}/>
    </div>
);