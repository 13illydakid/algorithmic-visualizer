import { createAction, handleActions } from 'redux-actions';

export const RESET_STATS = 'RESET_STATS';
export const INC_COMPARISONS = 'INC_COMPARISONS';
export const INC_SWAPS = 'INC_SWAPS';

export const resetStats = createAction(RESET_STATS);
export const incComparisons = createAction(INC_COMPARISONS); // payload: number (default 1)
export const incSwaps = createAction(INC_SWAPS); // payload: number (default 1)

const initialState = { comparisons: 0, swaps: 0 };

export const stats = handleActions({
  RESET_STATS: () => initialState,
  INC_COMPARISONS: (state, { payload }) => ({ ...state, comparisons: state.comparisons + (payload || 1) }),
  INC_SWAPS: (state, { payload }) => ({ ...state, swaps: state.swaps + (payload || 1) }),
}, initialState);
