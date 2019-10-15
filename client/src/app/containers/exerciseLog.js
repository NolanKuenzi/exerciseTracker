import React, { useState } from 'react';
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

  const [userId, setUserId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [limit, setLimit] = useState('');

  /* eslint-disable */
  const deleteFunc = async event => {
    event.preventDefault();
    const confirm = window.confirm('Delete log entry?');
    if (confirm === false) {
      return;
    }
    try {
      const getInputs = document.getElementsByName('inputs');
      const deleteData = await axios.delete('https://sleepy-springs-16191.herokuapp.com/api/exercise/delete', {
        data: {
          userId,
          logId: event.target.id,
          from: getInputs[0].value === '' ? undefined : getInputs[0].value,
          to: getInputs[1].value === '' ? undefined : getInputs[1].value,
          limit: getInputs[2].value === '' ? undefined : getInputs[2].value,
        },
      });
      renderData(deleteData.data);
    } catch (error) {
      if (error.response !== undefined) {
        newData(<div className="displayErrs">{error.response.data}</div>);
        return;
      }
      newData(<div className="displayErrs">Error: Network Error</div>);
    }
  };
  const renderData = input => {
    if (input === null) {
      return;
    }
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
                    type="button"
                    id={item.logId}
                    name={input.userId}
                    className="logButton"
                    onClick={event => deleteFunc(event)}
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
  const exerciseLogSubmit = async event => {
    event.preventDefault();
    try {
      let url = `https://sleepy-springs-16191.herokuapp.com/api/exercise/log?userId=${userId}`;
      if (from !== '') {
        url = url.concat(`&from=${from}`);
      }
      if (to !== '') {
        url = url.concat(`&to=${to}`);
      }
      if (limit !== '') {
        url = url.concat(`&limit=${limit}`);
      }
      const getData = await axios.get(url);
      renderData(getData.data);
    } catch (error) {
      if (error.response !== undefined) {
        newData(<div className="displayErrs">{error.response.data}</div>);
        return;
      }
      newData(<div className="displayErrs">Error: Network Error</div>);
    }
  };
  return (
    <div className="inputDivs" data-testid="eLogTest">
      <form onSubmit={event => exerciseLogSubmit(event)}>
        <div id="logTop">
          <h3 id="eLogH3">Exercise Log</h3>
          <span id="getSpan" data-testid="innerSpanTest">
            {'GET /api/exercise/log?{userId}[&from][&to][&limit]'} <br />{' '}
            {'{ } = required, [ ] = optional'}
          </span>
        </div>
        <div>
          <input
            type="text"
            className="headings"
            placeholder="userId*"
            value={userId}
            onChange={event => setUserId(event.target.value)}
          />
          <input
            type="text"
            name="inputs"
            className="headings"
            placeholder="from (yyyy-mm-dd)"
            value={from}
            onChange={event => setFrom(event.target.value)}
          />
          <input
            type="text"
            name="inputs"
            className="headings"
            placeholder="to (yyyy-mm-dd)"
            value={to}
            onChange={event => setTo(event.target.value)}
          />
          <input
            type="text"
            name="inputs"
            className="headings"
            placeholder="limit (number)"
            value={limit}
            onChange={event => setLimit(event.target.value)}
          />
          <button type="submit" className="headings" id="eLogBtn">
            <span>Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseLog;
