import { createAction, handleActions } from 'redux-actions';

export const SET_PAUSED = 'SET_PAUSED';
export const setPaused = createAction(SET_PAUSED); // payload: boolean

const initialState = false;

export const paused = handleActions({
  SET_PAUSED: (state, { payload }) => payload,
}, initialState);
