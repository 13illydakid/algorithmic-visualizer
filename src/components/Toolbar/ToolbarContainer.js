import { connect } from "react-redux";
import bubbleSort from "../../algorithms/bubbleSort.js";
import bucketSort from "../../algorithms/bucketSort.js";
import countingSort from "../../algorithms/countingSort.js";
import heapSort from "../../algorithms/heapSort.js";
import insertionSort from "../../algorithms/insertionSort.js";
import mergeSort from "../../algorithms/mergeSort.js";
import quickSort from "../../algorithms/quickSort.js";
import radixSort from "../../algorithms/radixSort.js";
import selectionSort from "../../algorithms/selectionSort.js";
import shellSort from "../../algorithms/shellSort.js";
import { setAlgorithm } from "../../reducers/algorithm";
import { setArray } from "../../reducers/array";
import { setCurrentBubbleTwo } from "../../reducers/bubbleSort";
import { setCurrentBucket } from "../../reducers/bucketSort";
import { setCurrentCountIndex } from "../../reducers/countingSort";
import { clearEta, setEta } from '../../reducers/eta';
import { setCurrentHeapThree } from "../../reducers/heapSort";
import { setCurrentInsertion } from "../../reducers/insertionSort";
import { setCurrentMergeX } from "../../reducers/mergeSort";
import { setPaused } from "../../reducers/paused";
import { updatePerf } from '../../reducers/perf';
import { setCurrentQuickTwo, setPivot } from "../../reducers/quickSort";
import { setRunning } from "../../reducers/running";
import { setSelectedAlgorithms } from "../../reducers/running/selectedAlgorithms/index.js";
import { selectionSortPivot, selectionSort as selectionSortState } from "../../reducers/selectionSort"; // ensure reducers exist
import { setShellGap, setShellIndices } from "../../reducers/shellSort";
import { setCurrentSorted } from "../../reducers/sorted";
import { setSpeed } from '../../reducers/speed';
import { incComparisons, incSwaps } from "../../reducers/stats";
import { setCurrentSwappers } from "../../reducers/swappers";
import store from "../../store";
import DispatchQueue from "../../utils/dispatchQueue";
import { computeDelay } from '../../utils/speedMapping';
import Toolbar from "./Toolbar.jsx";

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
  turbo,
}) => ({
  array,
  algorithm,
  isRunning,
  selectedAlgorithms,
  speed,
  paused,
  turbo,
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
    dispatch(clearEta());
    const state = store.getState();
    const delay = computeDelay(state.speed);
    if (algorithm === 'bubbleSort' || algorithm === 'quickSort' || algorithm === 'mergeSort' || algorithm === 'heapSort' || algorithm === 'insertionSort' || algorithm === 'selectionSort' || algorithm === 'shellSort' || algorithm === 'countingSort' || algorithm === 'bucketSort' || algorithm === 'radixSort') {
      const { events } = fn(array);
      // Pre-run ETA estimate: events * delay (ms) / 1000
      const estSeconds = (events.length * delay) / 1000;
      dispatch(setEta(estSeconds));

      // Emergency optimization for very large event counts
      let processed = events;
      if (events.length > 50000) {
        console.warn(`Large event count detected: ${events.length}. Applying emergency optimization.`);
        // More aggressive thinning for massive arrays
        let c = 0;
        processed = events.filter(e => {
          if (e.type === 'highlightCompare') {
            c++; return (c % 10) === 0; // Keep only 1 in 10 compares
          }
          if (e.type === 'finalizeElement') {
            // Keep only every 5th finalization for very large arrays
            return (e.index % 5) === 0;
          }
          return true;
        });
      }

      // Turbo-aware thinning
      const turboCfg = state.turbo || { enabled: false };
      if (turboCfg.enabled && !processed.emergencyOptimized) {
        const keep = Math.max(1, turboCfg.keepCompare || 3);
        let c = 0;
        processed = processed.filter(e => {
          if (e.type === 'highlightCompare') {
            c++; return (c % keep) === 0;
          }
          return true;
        });
      }

      playCentral(processed, dispatch, store.getState, delay, algorithm, dispatch, state.turbo);
    } else {
      fn(array, dispatch, delay);
    }
  },
});

// ---------------- Queue Playback (migrated algorithms) ----------------
let activeQueue = null;

function playCentral(events, dispatch, getState, baseDelay, algorithm, rootDispatch, turboCfg) {
  activeQueue = new DispatchQueue({
    dispatch,
    getState,
    delayProvider: () => computeDelay(getState().speed),
    onComplete: () => dispatch(setRunning(false)),
    perfCallback: (metrics) => rootDispatch(updatePerf(metrics)),
  });
  // Maintain a sorted array directly to avoid repeated conversions & full sorts.
  let sortedArr = (getState().currentSorted || []).slice();
  const finalizeBatchSizeBase = turboCfg && turboCfg.enabled ? (turboCfg.finalizeBatch || 1) : 1;
  let pendingFinalize = [];
  let lastUpdateTime = 0;
  const UPDATE_THROTTLE = 50; // min ms between state updates
  // Future improvement: monitor EPS from perf reducer and dynamically adjust
  //  - thinning (keepCompare)
  //  - finalize batching escalation thresholds
  // by dispatching turbo config updates when sustained EPS < target for N frames.
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
        pendingFinalize.push(e.index);
        // Adaptive finalize batch size based on progress and speed
        const total = getState().array.length || 1;
        const sortedCount = sortedArr.length + pendingFinalize.length;
        const progress = sortedCount / total;
        const currentSpeed = getState().speed || 1;

        let batchTarget = finalizeBatchSizeBase;
        // Super aggressive batching to prevent slowdown at completion
        if (progress > 0.3) batchTarget = Math.max(batchTarget, 5);
        if (progress > 0.5) batchTarget = Math.max(batchTarget, 10);
        if (progress > 0.7) batchTarget = Math.max(batchTarget, 25);
        if (progress > 0.85) batchTarget = Math.max(batchTarget, 50);
        if (progress > 0.95) batchTarget = Math.max(batchTarget, 100); // Very aggressive at the end

        // Speed-based batching multipliers
        if (currentSpeed >= 15) batchTarget = Math.max(batchTarget, 15);
        if (currentSpeed >= 20) batchTarget = Math.max(batchTarget, 40);

        // Emergency batching for very large arrays or late stage
        if (total > 300 && progress > 0.8) batchTarget = Math.max(batchTarget, 150);

        if (pendingFinalize.length >= batchTarget) {
          // Optimized batch processing
          const sorted = pendingFinalize.sort((a, b) => a - b);
          let insertions = 0;

          // Use more efficient batch insertion for large batches
          if (sorted.length > 20) {
            // For very large batches, just append and re-sort once
            const newSorted = [...sortedArr, ...sorted].sort((a, b) => a - b);
            const uniqueSorted = [...new Set(newSorted)]; // Remove duplicates
            if (uniqueSorted.length > sortedArr.length) {
              sortedArr = uniqueSorted;
              insertions = uniqueSorted.length - sortedArr.length + pendingFinalize.length;
            }
          } else {
            // Normal binary insertion for smaller batches
            sorted.forEach(x => {
              let lo = 0, hi = sortedArr.length - 1, found = false;
              while (lo <= hi) {
                const mid = (lo + hi) >> 1;
                if (sortedArr[mid] === x) { found = true; break; }
                if (sortedArr[mid] < x) lo = mid + 1;
                else hi = mid - 1;
              }
              if (!found) {
                sortedArr.splice(lo, 0, x);
                insertions++;
              }
            });
          }
          // Only dispatch if we actually made changes and enough time has passed
          if (insertions > 0) {
            const now = performance.now();
            if (now - lastUpdateTime > UPDATE_THROTTLE || progress > 0.98) {
              dispatch(setCurrentSorted(sortedArr.slice()));
              lastUpdateTime = now;
            }
          }
          pendingFinalize = [];
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
        sortedArr = arr.map((_, idx) => idx);
        pendingFinalize = [];
        dispatch(setCurrentSorted(sortedArr.slice()));
        break;
      }
      default: break;
    }
  });
  activeQueue.load(runners);

  // Add cleanup handler to finalize any pending elements when queue completes
  const originalOnComplete = activeQueue.onComplete;
  activeQueue.onComplete = () => {
    // Commit any remaining pending finalizations
    if (pendingFinalize.length > 0) {
      pendingFinalize.sort((a, b) => a - b).forEach(x => {
        let lo = 0, hi = sortedArr.length - 1, found = false;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if (sortedArr[mid] === x) { found = true; break; }
          if (sortedArr[mid] < x) lo = mid + 1;
          else hi = mid - 1;
        }
        if (!found) sortedArr.splice(lo, 0, x);
      });
      // Final update - always dispatch on completion
      dispatch(setCurrentSorted(sortedArr.slice()));
    }
    originalOnComplete && originalOnComplete();
  };

  activeQueue.start();
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
