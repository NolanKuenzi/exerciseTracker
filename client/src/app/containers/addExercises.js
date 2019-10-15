import React, { useState } from 'react';
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

  const [userId, setUserId] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');

  const addExercisesSubmit = async event => {
    event.preventDefault();
    event.persist();
    try {
      const body = {
        userId,
        description,
        duration,
        date,
      };
      /* eslint-disable */
      const postData = await axios.post('https://sleepy-springs-16191.herokuapp.com/api/exercise/add', body);
      const addExercisesDiv = typeof postData.data === 'string' ? null : (
        <div id="addExerciseDiv">
          <h3>Entry Added:</h3>
          <b>{postData.data.date}</b> <br />
          Username: {postData.data.username} <br />
          Id: {postData.data.userId} <br />
          Description: {postData.data.description} <br />
          Duration: {postData.data.duration} mins. <br />
          Entry Number: {postData.data.count}
        </div>
      );
      const addExercisesData = typeof postData.data === 'string' ? (
        <div className="displayErrs">{postData.data}</div>
      ) : (
        addExercisesDiv
      );
      newData(addExercisesData);
      if (typeof postData.data !== 'string') {
        setUserId('');
        setDescription('');
        setDuration('');
        setDate('');
      } 
    } catch (error) {
      if (error.response !== undefined) {
        newData(<div className="displayErrs">{error.response.data}</div>);
        return;
      }
      newData(<div className="displayErrs">Error: Network Error</div>);
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
          <input type="text" placeholder="userId*" className="headings" value={userId} onChange={event => setUserId(event.target.value)} />
          <input type="text" placeholder="description*" className="headings" value={description} onChange={event => setDescription(event.target.value)}/>
          <input type="text" placeholder="duration* (mins.)" className="headings" value={duration} onChange={event => setDuration(event.target.value)} />
          <input type="text" placeholder="date (yyyy-mm-dd)" className="headings" value={date} onChange={event => setDate(event.target.value)} />
        </div>
        <button className="headings" type="submit" id="addExercisesSubmit">
          <span>Submit</span>
        </button>
      </form>
    </div>
  );
};

export default AddExercises;
