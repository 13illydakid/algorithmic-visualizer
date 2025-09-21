import { createAction, handleActions } from 'redux-actions';

export const SET_ETA = 'SET_ETA'; // seconds (float)
export const CLEAR_ETA = 'CLEAR_ETA';

export const setEta = createAction(SET_ETA); // payload seconds
export const clearEta = createAction(CLEAR_ETA);

export const eta = handleActions(
  {
    [SET_ETA]: (state, { payload }) => payload,
    [CLEAR_ETA]: () => null,
  },
  null
);
