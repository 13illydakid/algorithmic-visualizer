import { combineReducers } from "redux";
import { algorithm } from "./algorithm";
import { array } from "./array";
import { currentBubbleTwo } from "./bubbleSort";
import { bucketAssignments, currentBucket } from "./bucketSort";
import { currentCountIndex, currentOutputIndex } from "./countingSort";
import { currentHeapThree } from "./heapSort";
import { insertionSortReducer } from "./insertionSort";
import { currentMergeX } from "./mergeSort";
import { paused } from "./paused";
import { progress } from "./progress";
import { currentQuickTwo, pivot } from "./quickSort";
import { isRunning } from "./running";
import { selectedAlgorithms } from "./running/selectedAlgorithms";
import { selectionSort, selectionSortPivot } from "./selectionSort";
import { shellGap, shellIndices } from "./shellSort";
import { currentSorted } from "./sorted";
import { speed } from "./speed";
import { stats } from "./stats";
import { currentSwappers } from "./swappers";
// New reducers
import { eta } from "./eta";
import { perf } from "./perf";
import { turbo } from "./turbo";

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
  progress,
  eta,
  perf,
  turbo,
});

export default rootReducer;
