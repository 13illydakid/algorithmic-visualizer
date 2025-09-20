import { createAction, handleActions } from "redux-actions";

export const SET_CURRENT_COUNT_INDEX = "SET_CURRENT_COUNT_INDEX";
export const setCurrentCountIndex = createAction(SET_CURRENT_COUNT_INDEX);
export const SET_CURRENT_OUTPUT_INDEX = "SET_CURRENT_OUTPUT_INDEX";
export const setCurrentOutputIndex = createAction(SET_CURRENT_OUTPUT_INDEX);

// Tracks the index currently being counted or updated
const initialCountIndex = null;
const initialOutputIndex = null;

export const currentCountIndex = handleActions({
    SET_CURRENT_COUNT_INDEX: (state, { payload }) => {
      return payload;
    },
  }, initialCountIndex);

export const currentOutputIndex = handleActions({
    SET_CURRENT_OUTPUT_INDEX: (state, { payload }) => {
      return payload;
    },
  }, initialOutputIndex);
