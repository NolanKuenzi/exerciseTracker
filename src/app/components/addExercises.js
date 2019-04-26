import React from 'react';

const AddExercises = () => {
  return (
    <div id="addExercisesContainer" data-testid="addExercisesTest">
      <form action="http://localhost:3000/api/exercise/add" method="post" target="_blank">
        <h3 className="headings">Add Exercises</h3>
        <span className="headings">
          <span className="postSpan" data-testid="innerSpanTest">
            POST /api/exercise/add{' '}
          </span>
        </span>
        <div id="inputDivs">
          <input
            type="text"
            placeholder="userId*"
            className="headings"
            name="userId"
            data-testid="userIdInput"
          />
          <input
            type="text"
            placeholder="description*"
            className="headings"
            name="description"
            data-testid="descriptionInput"
          />
          <input
            type="text"
            placeholder="duration* (mins.)"
            className="headings"
            name="duration"
            data-testid="durationInput"
          />
          <input
            type="text"
            placeholder="date (yyyy-mm-dd)"
            className="headings"
            name="date"
            data-testid="dataInput"
          />
        </div>
        <button className="headings" type="submit">
          <span id="submitText">Submit</span>
        </button>
      </form>
    </div>
  );
};

export default AddExercises;
