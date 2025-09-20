import { createAction, handleActions } from "redux-actions";

export const SET_SPEED = "SET_SPEED";
export const setSpeed = createAction(SET_SPEED); // payload: number (ms delay)

const initialState = 50; // default slider value (we'll map to ms)

export const speed = handleActions({
  SET_SPEED: (state, { payload }) => payload,
}, initialState);
