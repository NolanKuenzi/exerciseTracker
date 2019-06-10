import React from 'react';
import ReactDOM from 'react-dom';
import ExerciseTracker from './app/components/exerciseTracker';
import './myStyles.scss';

const App = () => {
  return (
    <div>
      <ExerciseTracker />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
