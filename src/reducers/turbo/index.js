import { createAction, handleActions } from 'redux-actions';

export const SET_TURBO = 'SET_TURBO'; // payload: { enabled, keepCompare, finalizeBatch }
export const setTurbo = createAction(SET_TURBO);

const initial = { enabled: false, keepCompare: 3, finalizeBatch: 1 };

export const turbo = handleActions(
  {
    [SET_TURBO]: (state, { payload }) => ({ ...state, ...payload }),
  },
  initial
);
