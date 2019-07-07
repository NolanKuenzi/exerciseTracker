import React from 'react';
import NewUser from '../containers/newUser';
import AddExercises from '../containers/addExercises';
import ExerciseLog from '../containers/exerciseLog';
import Display from './display';
import Footer from './footer';

const ExerciseTracker = () => {
  return (
    <div id="exerciseTrackerDiv">
      <h1>Exercise Tracker</h1>
      <div id="exerciseTrackerBlocks">
        <NewUser />
        <AddExercises />
        <ExerciseLog />
      </div>
      <Display />
      <Footer />
    </div>
  );
};

export default ExerciseTracker;

