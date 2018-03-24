import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {getTrainsByStation} from 'services/TrainsService';
import {formatDate} from 'utilities';
import 'styles/Station.css';

let urlNameToHumanReadableName = {
  'kannelmaki': 'Kannelmäki',
  'huopalahti': 'Huopalahti',
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationShortCode: this.props.match.params.station,
      trains: [],
    };
  }

  componentDidMount() {
    getTrainsByStation(this.state.stationShortCode).then(trains => {
      this.setState({trains: trains});
    });
  }

  render() {
    let {station} = this.props.match.params;
    let {trains} = this.state;

    return (
        <div className="station">
          {urlNameToHumanReadableName[station]}
          {trains.map(train =>
              <div key={train.number}>
                <Link to={'/' + train.number}>
                  {formatDate(train.scheduledDepartureTime)}
                  {' - '}
                  {train.number}
                  {' - '}
                  {train.letter}
                </Link>
              </div>
          )}
        </div>
    );
  }
}

export default App;