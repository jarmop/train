import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {getTrainsByStation} from 'services/StationService';
import {formatTimeShort} from 'utilities';
import 'styles/Station.css';
import {getUrl} from '../utilities';

let urlNameToHumanReadableName = {
  'kannelmaki': 'Kannelmäki',
  'huopalahti': 'Huopalahti',
  'helsinki': 'Helsinki',
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
          <h1 className="station__name">
            {urlNameToHumanReadableName[station]}
          </h1>
          <table className="station-train-table">
            <thead>
            <tr>
              <th className="station-train-table__element">Departs</th>
              <th className="station-train-table__element station-train-table__element--centered">Code</th>
              <th className="station-train-table__element">Number</th>
              <th className="station-train-table__element station-train-table__element--centered">track</th>
            </tr>
            </thead>
            <tbody>
            {trains.map(train =>
                <tr key={train.number} className="station-train-table__train">
                  <td className="station-train-table__element">
                    {formatTimeShort(train.scheduledDepartureTime)}
                  </td>
                  <td className="station-train-table__element station-train-table__element--centered">
                    <Link
                        key={train.number}
                        to={getUrl('/' + train.number)}
                        className="station-train-link"
                    >
                      {train.code}
                    </Link>
                  </td>
                  <td className="station-train-table__element">
                    {train.number}
                  </td>
                  <td className="station-train-table__element station-train-table__element--centered">
                    {train.track}
                  </td>
                </tr>
            )}
            </tbody>
          </table>

        </div>
    );
  }
}

export default App;