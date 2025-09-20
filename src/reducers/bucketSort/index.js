import { createAction, handleActions } from "redux-actions";

// Action Types
export const SET_CURRENT_BUCKET = "SET_CURRENT_BUCKET";
export const SET_BUCKET_ASSIGNMENTS = "SET_BUCKET_ASSIGNMENTS";

// Action Creators
export const setCurrentBucket = createAction(SET_CURRENT_BUCKET); // for animation focus
export const setBucketAssignments = createAction(SET_BUCKET_ASSIGNMENTS); // to assign items to buckets

// Initial State
const initialCurrentBucket = null;
const initialBucketAssignments = []; // optional: tracks which item belongs to which bucket

// Reducers
export const currentBucket = handleActions({
    SET_CURRENT_BUCKET: (state, { payload }) => {
      return payload;
    },
  }, initialCurrentBucket);

export const bucketAssignments = handleActions({
    SET_BUCKET_ASSIGNMENTS: (state, { payload }) => {
      return payload;
    },
  }, initialBucketAssignments);
