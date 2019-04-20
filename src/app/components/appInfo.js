import React from 'react';

const AppInformation = () => {
  return (
    <div id="appInfoContainer">
      <span>
        <b>GET users's exercise log: </b>
      </span>
      <span id="getRoute">{'GET /api/exercise/log?{userId}[&from][&to][&limit]'}</span>
      <br />
      <br />
      <span>{'{ } = required, [ ] = optional'}</span>
      <br />
      <br />
      <span>
        <b>from, to</b> = dates (yyyy-mm-dd); <b>limit</b> = number
      </span>
    </div>
  );
};

export default AppInformation;
