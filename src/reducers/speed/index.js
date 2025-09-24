import { createAction, handleActions } from "redux-actions";

export const SET_SPEED = "SET_SPEED";
// payload: number representing speed multiplier (e.g., 1,3,5,...)
export const setSpeed = createAction(SET_SPEED);

// Default speed multiplier (5x)
const initialState = 2;

export const speed = handleActions({
  SET_SPEED: (state, { payload }) => payload,
}, initialState);
