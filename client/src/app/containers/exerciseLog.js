import React from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import { Store } from '../store';

const ExerciseLog = () => {
  const { dispatch } = React.useContext(Store);

  const newData = item => {
    return dispatch({
      type: 'NEW_DATA',
      item,
    });
  };
  /* eslint-disable */
  const renderData = input => {
    const exerciseLogDiv = typeof input === 'string' ? (
      <div className="displayErrs">{input}</div>
    ) : (
      <div id="eLogDiv">
        <h3 id="eLogUser">
          {input.username}
          {"'s"} Exercise Log:
        </h3>
        <ul>
          {input.log.map(item => (
            <li key={item.logId}>
              <div className="logButtonClass">
                <button
                  type="submit"
                  id={item.logId}
                  name={input.userId}
                  className="logButton"
                  onClick={e => deleteFunc(e)}
                >
                  {'X'}
                </button>
              </div>
              <b>{item.date}</b> <br />
                Description: {item.description} <br />
                Duration: {item.duration} mins. <br />
            </li>
          ))}
        </ul>
      </div>
    );
    newData(exerciseLogDiv);
  };
  const deleteFunc = async e => {
    e.preventDefault();
    const confirm = window.confirm('Delete log entry?');
    if (confirm === false) {
      return;
    }
    try {
      const getInputs = document.getElementsByTagName('input');
      const deleteData = await axios.delete('https://sleepy-springs-16191.herokuapp.com/api/exercise/delete', {
        data: {
          userId: e.target.name,
          logId: e.target.id,
          from: getInputs[6].value === '' ? undefined : getInputs[6].value,
          to: getInputs[7].value === '' ? undefined : getInputs[7].value,
          limit: getInputs[8].value === '' ? undefined : getInputs[8].value,
        },
      });
      const response = await deleteData;
      renderData(response.data);
    } catch (error) {
      if (error.response !== undefined) {
        renderData(error.response.data);
        return;
      }
      renderData('Error: Unable to access data');
    }
  };
  const exerciseLogSubmit = async event => {
    event.preventDefault();
    try {
      const getInputs = document.getElementsByTagName('input');
      let url = `https://sleepy-springs-16191.herokuapp.com/api/exercise/log?userId=${getInputs[5].value}`;
      if (getInputs[6].value !== '') {
        url = url.concat(`&from=${getInputs[6].value}`);
      }
      if (getInputs[7].value !== '') {
        url = url.concat(`&to=${getInputs[7].value}`);
      }
      if (getInputs[8].value !== '') {
        url = url.concat(`&limit=${getInputs[8].value}`);
      }
      const getData = await axios.get(url);
      const response = await getData;
      renderData(response.data);
    } catch (error) {
      if (error.response !== undefined) {
        renderData(error.response.data);
        return;
      }
      renderData('Error: Unable to access data');
    }
  };
  return (
    <div className="inputDivs" data-testid="eLogTest">
      <form onSubmit={(event) => exerciseLogSubmit(event)}>
        <div id="logTop">
          <h3 id="eLogH3">Exercise Log</h3>
          <span id="getSpan" data-testid="innerSpanTest">
            {'GET /api/exercise/log?{userId}[&from][&to][&limit]'} <br />{' '}
            {'{ } = required, [ ] = optional'}
          </span>
        </div>
        <div>
          <input type="text" className="headings" name="userId" placeholder="userId*" />
          <input type="text" className="headings" name="from" placeholder="from (yyyy-mm-dd)" />
          <input type="text" className="headings" name="to" placeholder="to (yyyy-mm-dd)" />
          <input type="text" className="headings" name="limit" placeholder="limit (number)" />
          <button type="submit" className="headings" id="eLogBtn">
            <span>Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseLog;