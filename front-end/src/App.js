import React, {Component} from 'react';
import 'font-awesome/css/font-awesome.css';
import './App.css';
import {
  addLeadingZero,
} from './service';
import ApiRace from './ApiRace';
import Detail from './Detail';

const formatDate = (timestamp) => {
  let date = new Date(timestamp);
  return addLeadingZero(date.getHours())
      + ':'
      + addLeadingZero(date.getMinutes())
      + ':'
      + addLeadingZero(date.getSeconds());
};

class App extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
  }

  render() {
    return (
        <div className="container">
          <Detail/>
          <ApiRace/>
        </div>
    );
  }
}

export default App;

let Track = () => (
    <div className="track">
      <div className="train"></div>
    </div>
);