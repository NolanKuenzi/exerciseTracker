import React from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import { Store } from '../store';

const NewUser = () => {
  const { dispatch } = React.useContext(Store);

  const newData = item => {
    return dispatch({
      type: 'NEW_DATA',
      item,
    });
  };
  const newUserSubmit = async event => {
    event.preventDefault();
    event.persist();
    try {
      const getData = await axios.post(
        'https://sleepy-springs-16191.herokuapp.com/api/exercise/new-user',
        {
          userName: document.getElementsByName('userName')[0].value,
        },
      );
      /* eslint-disable */
      const response = await getData;
      const newUserDiv = (
        <div id="displayNewUsr">
          New User: {response.data.username} <br /> Id: {response.data.userId}
        </div>
      );
      const newUsrData = typeof response.data === 'string' ? <div className="displayErrs">{response.data}</div> : newUserDiv;
      newData(newUsrData);
      event.target.reset();
    } catch (error) {
      if (error.response !== undefined) {
        newData(error.response.data);
        return;
      }
      newData('An error occurred while connecting to MongoDB Atlas');
    }
  };
  return (
    <div className="inputDivs">
      <form onSubmit={event => newUserSubmit(event)}>
        <div data-testid="userContainerTest">
          <h3 className="headings" id="newUserText">
            Create a New User
          </h3>
          <span className="headings">
            <span className="postSpan">POST /api/exercise/new-user </span>
          </span>
          <div>
            <input
              type="text"
              placeholder="username"
              className="headings"
              name="userName"
            />
            <button className="headings" type="submit" id="newUserSubmit">
              <span>Submit</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewUser;
