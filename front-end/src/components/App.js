import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import 'font-awesome/css/font-awesome.css';
import 'styles/App.css';
import ApiRace from 'components/ApiRace';
import Detail from 'components/Detail';
import Station from 'components/Station';
import {getUrl} from 'utilities';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="container">
          <header>
            <Link to={getUrl('/')} className="">Home</Link>
          </header>
          <main>
            <Route exact path={getUrl('/')} component={Home}/>
            <Route path={getUrl('/station/:station(kannelmaki|huopalahti)')} component={Station}/>
            <Route exact path={getUrl('/:train')} component={Train}/>
          </main>
        </div>
    );
  }
}

export default App;

let Home = () => (
    <div>
      <Link to={getUrl('/station/kannelmaki')} className="station-link">Kannelmäki</Link>
      <Link to={getUrl('/station/huopalahti')} className="station-link">Huopalahti</Link>
    </div>
);

let Train = ({match}) => (
    <div>
      <Detail trainNumber={match.params.train}/>
      <ApiRace trainNumber={match.params.train}/>
    </div>
);