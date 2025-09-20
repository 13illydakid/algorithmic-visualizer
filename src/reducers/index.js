import { combineReducers } from "redux";
import { array } from "./array";
import { algorithm } from "./algorithm";
import { currentBubbleTwo } from "./bubbleSort";
import { currentQuickTwo, pivot } from "./quickSort";
import { currentSwappers } from "./swappers";
import { currentHeapThree } from "./heapSort";
import { currentSorted } from "./sorted";
import { currentMergeX } from "./mergeSort";
import { isRunning } from "./running";
import { selectedAlgorithms } from "./selectedAlgorithms";
import { selectionSort, selectionSortPivot } from "./selectionSort";
import { insertionSortReducer } from "./insertionSort";
import { currentBucket, bucketAssignments } from "./bucketSort";
import { currentCountIndex, currentOutputIndex } from "./countingSort";
import { shellGap, shellIndices } from "./shellSort";
import { speed } from "./speed";
import { paused } from "./paused";
import { stats } from "./stats";

const rootReducer = combineReducers({
  array,
  algorithm,
  currentBubbleTwo,
  currentQuickTwo,
  pivot,
  currentSwappers,
  currentHeapThree,
  currentSorted,
  currentMergeX,
  isRunning,
  selectedAlgorithms,
  selectionSort,
  selectionSortPivot,
  insertionSortReducer,
  currentBucket,
  bucketAssignments,
  currentCountIndex,
  currentOutputIndex,
  shellGap,
  shellIndices,
  speed,
  paused,
  stats,
});

export default rootReducer;
