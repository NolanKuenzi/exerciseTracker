import React, { useState } from 'react';
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

  const [userName, setUserName] = useState('');

  const newUserSubmit = async event => {
    event.preventDefault();
    event.persist();
    try {
      const postData = await axios.post(
        'https://sleepy-springs-16191.herokuapp.com/api/exercise/new-user',
        {
          userName,
        },
      );
      /* eslint-disable */
      const newUserDiv = (
        <div id="displayNewUsr">
          New User: {postData.data.username} <br /> Id: {postData.data.userId}
        </div>
      );
      newData(newUserDiv);
      setUserName('');
    } catch (error) {
      if (error.response !== undefined) {
        newData(<div className="displayErrs">{error.response.data}</div>);
        return;
      }
      newData(<div className="displayErrs">Error: Network Error</div>);
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
              value={userName}
              onChange={event => setUserName(event.target.value)}
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
