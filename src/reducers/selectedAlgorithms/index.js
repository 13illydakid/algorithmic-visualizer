import { createAction, handleActions } from "redux-actions";

const initialState = [];

export const SET_SELECTED_ALGORITHMS = "SET_SELECTED_ALGORITHMS";
export const setSelectedAlgorithms = createAction(SET_SELECTED_ALGORITHMS);

export const selectedAlgorithms = handleActions({
  SET_SELECTED_ALGORITHMS: (state, { payload }) => {
    return payload;
  },
}, initialState);

// export const setSelectedAlgorithms = (algorithms) => ({
//   type: SET_SELECTED_ALGORITHMS,
//   payload: algorithms,
// });

// const selectedAlgorithms = (state = [], action) => {
//   switch (action.type) {
//     case SET_SELECTED_ALGORITHMS:
//       return action.payload;
//     default:
//       return state;
//   }
// };

// export default selectedAlgorithms;
