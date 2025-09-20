import { createAction, handleActions } from "redux-actions";

// Initial State
const initialState = [];

// Action Types
export const SET_CURRENT_INSERTION = "SET_CURRENT_INSERTION";

// Action Creators
export const setCurrentInsertion = createAction(SET_CURRENT_INSERTION);

// Reducer
export const insertionSortReducer = handleActions({
    SET_CURRENT_INSERTION: (state, { payload }) => {
      return payload;
    },
  }, initialState);

