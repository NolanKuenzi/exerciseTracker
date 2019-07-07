import React from 'react';
import { Store } from '../store';

const Display = () => {
  const { state } = React.useContext(Store);
  return <div id="displayDiv">{state.data === null ? null : state.data}</div>;
};

export default Display;
