import React from 'react';

const NewUser = () => {
  return (
    <div>
      <form>
        <div id="newUserContainer" data-testid="userContainerTest">
          <h3 className="headings" id="newUserText">
            Create a New User
          </h3>
          <span className="headings">
            <span className="postSpan">POST /api/exercise/new-user </span>
          </span>
          <input
            type="text"
            placeholder="username"
            className="headings"
            id="userNameInput"
            data-testid="userNameInputTest"
          />
          <button className="headings">
            <span id="submitText">Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewUser;
