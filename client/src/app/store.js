import React from 'react';

const Store = React.createContext();

const initialState = {
  data: null,
};

function reducer(state, action) {
  if (action.type === 'NEW_DATA') {
    return Object.assign({}, state, {
      data: action.item,
    });
  }
  return state;
}

function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

export { Store, StoreProvider };
