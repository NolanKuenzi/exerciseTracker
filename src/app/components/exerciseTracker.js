import React from 'react';
import NewUser from '../containers/newUser';
import AddExercises from '../containers/addExercises';
import AppInformation from './appInfo';
import Footer from './footer';

const ExerciseTracker = () => {
  return (
    <div>
      <h1>Exercise Tracker</h1>
      <div id="exerciseTrackerBlocks">
        <NewUser />
        <AddExercises />
      </div>
      <AppInformation />
      <Footer />
    </div>
  );
};

export default ExerciseTracker;
