import React from 'react';
import { Route, Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.css';
import 'styles/App.css';
import ApiRace from 'components/ApiRace';
import Detail from 'components/Detail';
import Station from 'components/Station';
import { getUrl } from 'utilities';

const App = () => {
  return (
    <div className="container">
      <header>
        <Link to={getUrl('/')} className="">Home</Link>
      </header>
      <main>
        <Route exact path={getUrl('/')} component={Home} />
        <Route path={getUrl('/station/:station')} component={Station} />
        <Route exact path={getUrl('/:train')} component={Train} />
      </main>
    </div>
  );
}

export default App;

let Home = () => (
  <div>
    <Link to={getUrl('/station/kannelmaki')} className="station-link">Kannelmäki</Link>
    <Link to={getUrl('/station/huopalahti')} className="station-link">Huopalahti</Link>
    <Link to={getUrl('/station/helsinki')} className="station-link">Helsinki</Link>
  </div>
);

let Train = ({ match }) => (
  <div>
    <Detail trainNumber={match.params.train} />
    <ApiRace trainNumber={match.params.train} />
  </div>
);