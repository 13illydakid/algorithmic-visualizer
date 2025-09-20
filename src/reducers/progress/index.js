import { createAction, handleActions } from 'redux-actions';

export const SET_PROGRESS = 'SET_PROGRESS'; // payload: percentage (0-100)
export const RESET_PROGRESS = 'RESET_PROGRESS';

export const setProgress = createAction(SET_PROGRESS); // number
export const resetProgress = createAction(RESET_PROGRESS);

const initialState = 0;

export const progress = handleActions({
  SET_PROGRESS: (state, { payload }) => payload,
  RESET_PROGRESS: () => 0,
}, initialState);
