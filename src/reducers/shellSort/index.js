import { createAction, handleActions } from "redux-actions";

// Action Types
export const SET_SHELL_GAP = "SET_SHELL_GAP";
export const SET_SHELL_INDICES = "SET_SHELL_INDICES";

// Action Creators
export const setShellGap = createAction(SET_SHELL_GAP); // payload: number
export const setShellIndices = createAction(SET_SHELL_INDICES); // payload: [i, j]

// Initial States
const initialGap = null;
const initialIndices = [];

// Reducers
export const shellGap = handleActions({
    SET_SHELL_GAP: (state, { payload }) => {
      return payload;
    },
  }, initialGap);

export const shellIndices = handleActions({
    SET_SHELL_INDICES: (state, { payload }) => {
      return payload;
    },
  }, initialIndices);
