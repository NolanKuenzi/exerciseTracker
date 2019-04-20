import React from 'react';

const AddExercises = () => {
  return (
    <div id="addExercisesContainer" data-testid="addExercisesTest">
      <h3 className="headings">Add Exercises</h3>
      <span className="headings">
        <span className="postSpan" data-testid="innerSpanTest">
          POST /api/exercise/add{' '}
        </span>
      </span>
      <div id="inputDivs">
        <input type="text" placeholder="userId*" className="headings" data-testid="userIdInput" />
        <input
          type="text"
          placeholder="description*"
          className="headings"
          data-testid="descriptionInput"
        />
        <input
          type="text"
          placeholder="duration* (mins.)"
          className="headings"
          data-testid="durationInput"
        />
        <input
          type="text"
          placeholder="data (yyy-mm-dd)"
          className="headings"
          data-testid="dataInput"
        />
      </div>
      <button className="headings">
        <span id="submitText">Submit</span>
      </button>
    </div>
  );
};

export default AddExercises;
