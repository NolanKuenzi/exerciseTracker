import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider } from './app/store';
import ExerciseTracker from './app/components/exerciseTracker';
import './myStyles.scss';

const App = () => {
  return (
    <div>
      <ExerciseTracker />
    </div>
  );
};

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById('app'),
);
