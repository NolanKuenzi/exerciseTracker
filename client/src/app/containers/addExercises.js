import React from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import { Store } from '../store';

const AddExercises = () => {
  const { dispatch } = React.useContext(Store);

  const newData = item => {
    return dispatch({
      type: 'NEW_DATA',
      item,
    });
  };
  const addExercisesSubmit = async event => {
    event.preventDefault();
    event.persist();
    const getInputs = document.getElementsByTagName('input');
    try {
      const body = {
        userId: getInputs[1].value,
        description: getInputs[2].value,
        duration: getInputs[3].value,
        date: getInputs[4].value,
      };
      /* eslint-disable */
      const getData = await axios.post('https://sleepy-springs-16191.herokuapp.com/api/exercise/add', body);
      const response = await getData;
      const addExercisesDiv = typeof response.data === 'string' ? null : (
        <div id="addExerciseDiv">
          <h3>Entry Added:</h3>
          <b>{response.data.date}</b> <br />
          Username: {response.data.username} <br />
          Id: {response.data.userId} <br />
          Description: {response.data.description} <br />
          Duration: {response.data.duration} mins. <br />
          Entry Number: {response.data.count}
        </div>
      );
      const addExercisesData = typeof response.data === 'string' ? (
        <div className="displayErrs">{response.data}</div>
      ) : (
        addExercisesDiv
      );
      newData(addExercisesData);
      if (typeof response.data !== 'string') {
        event.target.reset();
      } 
    } catch (error) {
      console.log(error);
      newData('Error: Unable to access data');
    }
  };
  return (
    <div className="inputDivs" data-testid="addExercisesTest">
      <form onSubmit={event => addExercisesSubmit(event)}>
        <h3 className="headings">Add Exercises</h3>
        <span className="headings">
          <span className="postSpan">POST /api/exercise/add </span>
        </span>
        <div>
          <input type="text" placeholder="userId*" className="headings" name="userId" />
          <input type="text" placeholder="description*" className="headings" name="description" />
          <input type="text" placeholder="duration* (mins.)" className="headings" name="duration" />
          <input type="text" placeholder="date (yyyy-mm-dd)" className="headings" name="date" />
        </div>
        <button className="headings" type="submit" id="addExercisesSubmit">
          <span>Submit</span>
        </button>
      </form>
    </div>
  );
};

export default AddExercises;
