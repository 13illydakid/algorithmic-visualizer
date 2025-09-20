import { connect } from "react-redux";
import Toolbar from "./Toolbar.jsx";
import { setArray } from "../../reducers/array";
import { setAlgorithm } from "../../reducers/algorithm";
import { setCurrentSorted } from "../../reducers/sorted";
import { setRunning } from "../../reducers/running";
import { setSelectedAlgorithms } from "../../reducers/selectedAlgorithms";
import bubbleSort from "../../algorithms/bubbleSort.js";
import quickSort from "../../algorithms/quickSort.js";
import heapSort from "../../algorithms/heapSort.js";
import mergeSort from "../../algorithms/mergeSort.js";
import selectionSort from "../../algorithms/selectionSort.js";
import insertionSort from "../../algorithms/insertionSort.js";
import bucketSort from "../../algorithms/bucketSort.js";
import countingSort from "../../algorithms/countingSort.js";
import radixSort from "../../algorithms/radixSort.js";
import shellSort from "../../algorithms/shellSort.js";
import { setPaused } from "../../reducers/paused";
import DispatchQueue from "../../utils/dispatchQueue";
import store from "../../store";
import { setCurrentBubbleTwo } from "../../reducers/bubbleSort";
import { setCurrentQuickTwo, setPivot } from "../../reducers/quickSort";
import { setCurrentSwappers } from "../../reducers/swappers";
import { setCurrentMergeX } from "../../reducers/mergeSort";
import { setCurrentHeapThree } from "../../reducers/heapSort";
import { setCurrentInsertion } from "../../reducers/insertionSort";
import { selectionSort as selectionSortState, selectionSortPivot } from "../../reducers/selectionSort"; // ensure reducers exist
import { setShellGap, setShellIndices } from "../../reducers/shellSort";
import { setCurrentBucket } from "../../reducers/bucketSort";
import { setCurrentCountIndex } from "../../reducers/countingSort";
import { incComparisons, incSwaps } from "../../reducers/stats";
import { setSpeed } from '../../reducers/speed';
import { computeDelay } from '../../utils/speedMapping';

// speed reducer imported in root; value accessed via mapStateToProps

const SORT_MAP = {
  bubbleSort,
  quickSort,
  heapSort,
  mergeSort,
  selectionSort,
  insertionSort,
  bucketSort,
  countingSort,
  radixSort,
  shellSort,
};

const mapStateToProps = ({
  array,
  algorithm,
  isRunning,
  selectedAlgorithms,
  speed,
  paused,
}) => ({
  array,
  algorithm,
  isRunning,
  selectedAlgorithms,
  speed,
  paused,
});

const mapDispatchToProps = (dispatch) => ({
  generateArray: (length) => {
    let array = [];
    while (array.length < length) {
      array.push(Math.floor(Math.random() * 200) + 10);
    }
    dispatch(setArray(array));
    dispatch(setCurrentSorted([]));
  },

  setArray: (arr) => {
    dispatch(setArray(arr));
    dispatch(setCurrentSorted([]));
  },

  setSpeed: (multiplier) => dispatch(setSpeed(multiplier)),

  updateSelectedAlgorithms: (algos) => dispatch(setSelectedAlgorithms(algos)),

  updateAlgorithm: (algorithm) => {
    dispatch(setAlgorithm(algorithm));
  },

  dispatchSetPaused: (val) => {
    dispatch(setPaused(val));
    if (activeQueue) {
      if (val) activeQueue.pause(); else activeQueue.resume();
    }
  },

  sort: (algorithm, array) => {
    const fn = SORT_MAP[algorithm];
    if (!fn) return;
    dispatch(setCurrentSorted([]));
    dispatch(setRunning(true));
    const state = store.getState();
    const delay = computeDelay(state.speed);
    if (algorithm === 'bubbleSort' || algorithm === 'quickSort' || algorithm === 'mergeSort' || algorithm === 'heapSort' || algorithm === 'insertionSort' || algorithm === 'selectionSort' || algorithm === 'shellSort' || algorithm === 'countingSort' || algorithm === 'bucketSort' || algorithm === 'radixSort') {
      const { events } = fn(array);
      playCentral(events, dispatch, store.getState, delay, algorithm);
    } else {
      fn(array, dispatch, delay);
    }
  },
});

// ---------------- Queue Playback (migrated algorithms) ----------------
let activeQueue = null;

function playCentral(events, dispatch, getState, baseDelay, algorithm) {
  activeQueue = new DispatchQueue({
    dispatch,
    getState,
    delayProvider: () => computeDelay(getState().speed),
    onComplete: () => dispatch(setRunning(false)),
  });
  const sortedSet = new Set(getState().currentSorted || []);
  const runners = events.map(e => () => {
    switch (e.type) {
      case 'highlightCompare': {
        if (algorithm === 'bubbleSort') dispatch(setCurrentBubbleTwo(e.indices));
        else if (algorithm === 'quickSort') dispatch(setCurrentQuickTwo(e.indices));
        else if (algorithm === 'mergeSort') dispatch(setCurrentMergeX(e.indices));
        else if (algorithm === 'heapSort') dispatch(setCurrentHeapThree(e.indices));
        else if (algorithm === 'insertionSort') dispatch(setCurrentInsertion(e.indices));
        else if (algorithm === 'selectionSort') {
          const [minIdx, jIdx] = e.indices;
          dispatch(selectionSortPivot(minIdx));
          dispatch(selectionSortState([minIdx, jIdx]));
        } else if (algorithm === 'shellSort') {
          dispatch(setShellIndices(e.indices));
        }
        dispatch(incComparisons());
        break;
      }
      case 'performSwap': {
        dispatch(setCurrentSwappers(e.indices));
        if (e.array) dispatch(setArray(e.array));
        dispatch(incSwaps());
        setTimeout(() => dispatch(setCurrentSwappers([])), baseDelay * 0.6);
        break;
      }
      case 'arrayUpdate': {
        dispatch(setArray(e.array));
        break;
      }
      case 'bucketPhase': {
        dispatch(setCurrentBucket(e.bucketIndex));
        break;
      }
      case 'countingTick': {
        dispatch(setCurrentCountIndex(e.value));
        break;
      }
      case 'gapUpdate': {
        dispatch(setShellGap(e.gap));
        break;
      }
      case 'digitPhase': { break; }
      case 'finalizeElement': {
        if (!sortedSet.has(e.index)) {
          sortedSet.add(e.index);
          const arrSorted = Array.from(sortedSet).sort((a, b) => a - b);
          dispatch(setCurrentSorted(arrSorted));
        }
        break;
      }
      case 'setPivot': {
        dispatch(setPivot(e.index));
        break;
      }
      case 'finalizeAll': {
        if (algorithm === 'quickSort') dispatch(setPivot(null));
        const arr = getState().array;
        const all = arr.map((_, idx) => idx);
        all.forEach(i => sortedSet.add(i));
        dispatch(setCurrentSorted(Array.from(sortedSet).sort((a, b) => a - b)));
        break;
      }
      default: break;
    }
  });
  activeQueue.load(runners);
  activeQueue.start();
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
