import { createAction, handleActions } from "redux-actions";

// Action Types
export const SET_CURRENT_SELECTION = "SET_CURRENT_SELECTION";
export const setCurrentSelection = createAction(SET_CURRENT_SELECTION);
export const SET_SELECTION_PIVOT = "SET_SELECTION_PIVOT";
export const setSelectionPivot = createAction(SET_SELECTION_PIVOT);

const initialCurrentSelection = [];
const initialPivot = null;

export const selectionSort = handleActions({
  SET_CURRENT_SELECTION: (state, { payload }) => {
    return payload;
  },
}, initialCurrentSelection);

export const selectionSortPivot = handleActions({
  SET_SELECTION_PIVOT: (state, { payload }) => {
    return payload;
  },
}, initialPivot);

/*
// Initial State
const initialState = {
  currentSelection: [], // e.g. [minIndex, j] or [i, minIndex]
  pivot: null,          // e.g. index of the current min
};

// Reducer
export const selectionSortReducer = handleActions({
  [setCurrentSelection]: (state, action) => ({
    ...state,
    currentSelection: action.payload,
  }),
  [setSelectionPivot]: (state, action) => ({
    ...state,
    pivot: action.payload,
  }),
},
initialState);
*/
