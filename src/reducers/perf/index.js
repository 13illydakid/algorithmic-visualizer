import { createAction, handleActions } from 'redux-actions';

export const UPDATE_PERF = 'UPDATE_PERF';
export const updatePerf = createAction(UPDATE_PERF); // payload: { fps, eps, batch }

const initial = { fps: 0, eps: 0, batch: 0 };

export const perf = handleActions(
  {
    [UPDATE_PERF]: (state, { payload }) => ({ ...state, ...payload }),
  },
  initial
);
