// Centralized sorting runner & playback queue integration.
// Unifies previous duplicated logic that lived in ToolbarContainer and SidebarContainer.
// Exports startSort(algorithm, array, dispatch, getState) plus pause/resume helpers.

import bubbleSort from "../algorithms/bubbleSort";
import bucketSort from "../algorithms/bucketSort";
import countingSort from "../algorithms/countingSort";
import heapSort from "../algorithms/heapSort";
import insertionSort from "../algorithms/insertionSort";
import mergeSort from "../algorithms/mergeSort";
import quickSort from "../algorithms/quickSort";
import radixSort from "../algorithms/radixSort";
import selectionSort from "../algorithms/selectionSort";
import shellSort from "../algorithms/shellSort";

import { setCurrentBubbleTwo } from "../reducers/bubbleSort";
import { setCurrentBucket } from "../reducers/bucketSort";
import { setCurrentCountIndex } from "../reducers/countingSort";
import { clearEta, setEta } from "../reducers/eta";
import { setCurrentHeapThree } from "../reducers/heapSort";
import { setCurrentInsertion } from "../reducers/insertionSort";
import { setCurrentMergeX } from "../reducers/mergeSort";
import { updatePerf } from "../reducers/perf";
import { setCurrentQuickTwo, setPivot } from "../reducers/quickSort";
import { setRunning } from "../reducers/running";
import { setCurrentSelection, setSelectionPivot } from "../reducers/selectionSort";
import { setShellGap, setShellIndices } from "../reducers/shellSort";
import { setCurrentSorted } from "../reducers/sorted";
import { incComparisons, incSwaps } from "../reducers/stats";
import { setCurrentSwappers } from "../reducers/swappers";
import DispatchQueue from "./dispatchQueue";
import { computeDelay } from "./speedMapping";

// Map algorithm id -> generator function
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

let activeQueue = null; // internal reference for pause/resume

export function pauseActiveQueue() {
  if (activeQueue) activeQueue.pause();
}

export function resumeActiveQueue() {
  if (activeQueue) activeQueue.resume();
}

export function startSort(algorithm, array, dispatch, getState) {
  const fn = SORT_MAP[algorithm];
  if (!fn) return;
  // Reset state
  dispatch(setCurrentSorted([]));
  dispatch(setRunning(true));
  dispatch(clearEta());

  const state = getState();
  const delay = computeDelay(state.speed);
  const { events } = fn(array);

  // ETA estimate (seconds)
  dispatch(setEta((events.length * delay) / 1000));

  // Aggressive thinning for huge sequences
  let processed = events;
  if (events.length > 50000) {
    let c = 0;
    processed = events.filter(e => {
      if (e.type === 'highlightCompare') { c++; return (c % 10) === 0; }
      if (e.type === 'finalizeElement') return (e.index % 5) === 0;
      return true;
    });
  }

  // Turbo thinning
  const turboCfg = state.turbo || { enabled: false };
  if (turboCfg.enabled && processed === events) { // only if not already thinned
    const keep = Math.max(1, turboCfg.keepCompare || 3);
    let c = 0;
    processed = processed.filter(e => {
      if (e.type === 'highlightCompare') { c++; return (c % keep) === 0; }
      return true;
    });
  }

  playCentral(processed, dispatch, getState, delay, algorithm, turboCfg);
}

function playCentral(events, dispatch, getState, baseDelay, algorithm, turboCfg) {
  activeQueue = new DispatchQueue({
    dispatch,
    getState,
    delayProvider: () => computeDelay(getState().speed),
    onComplete: () => dispatch(setRunning(false)),
    perfCallback: (m) => dispatch(updatePerf(m)),
  });

  let sortedArr = (getState().currentSorted || []).slice();
  const finalizeBatchSizeBase = turboCfg && turboCfg.enabled ? (turboCfg.finalizeBatch || 1) : 1;
  let pendingFinalize = [];
  let lastUpdateTime = 0;
  const UPDATE_THROTTLE = 50;

  const runners = events.map(e => () => {
    switch (e.type) {
      case 'highlightCompare': {
        if (algorithm === 'bubbleSort') dispatch(setCurrentBubbleTwo(e.indices));
        else if (algorithm === 'quickSort') dispatch(setCurrentQuickTwo(e.indices));
        else if (algorithm === 'mergeSort') dispatch(setCurrentMergeX(e.indices));
        else if (algorithm === 'heapSort') dispatch(setCurrentHeapThree(e.indices));
        else if (algorithm === 'insertionSort') dispatch(setCurrentInsertion(e.indices));
        else if (algorithm === 'selectionSort') { const [m, j] = e.indices; dispatch(setSelectionPivot(m)); dispatch(setCurrentSelection([m, j])); }
        else if (algorithm === 'shellSort') dispatch(setShellIndices(e.indices));
        dispatch(incComparisons());
        break;
      }
      case 'performSwap': {
        dispatch(setCurrentSwappers(e.indices));
        if (e.array) setArrayIfChanged(dispatch, getState, e.array);
        dispatch(incSwaps());
        setTimeout(() => dispatch(setCurrentSwappers([])), baseDelay * 0.6);
        break;
      }
      case 'arrayUpdate': {
        setArrayIfChanged(dispatch, getState, e.array);
        break;
      }
      case 'bucketPhase': dispatch(setCurrentBucket(e.bucketIndex)); break;
      case 'countingTick': dispatch(setCurrentCountIndex(e.value)); break;
      case 'gapUpdate': dispatch(setShellGap(e.gap)); break;
      case 'digitPhase': break; // no-op marker
      case 'finalizeElement': {
        pendingFinalize.push(e.index);
        const total = getState().array.length || 1;
        const sortedCount = sortedArr.length + pendingFinalize.length;
        const progress = sortedCount / total;
        const currentSpeed = getState().speed || 1;
        let batchTarget = finalizeBatchSizeBase;
        if (progress > 0.3) batchTarget = Math.max(batchTarget, 5);
        if (progress > 0.5) batchTarget = Math.max(batchTarget, 10);
        if (progress > 0.7) batchTarget = Math.max(batchTarget, 25);
        if (progress > 0.85) batchTarget = Math.max(batchTarget, 50);
        if (progress > 0.95) batchTarget = Math.max(batchTarget, 100);
        if (currentSpeed >= 15) batchTarget = Math.max(batchTarget, 15);
        if (currentSpeed >= 20) batchTarget = Math.max(batchTarget, 40);
        if (total > 300 && progress > 0.8) batchTarget = Math.max(batchTarget, 150);

        if (pendingFinalize.length >= batchTarget) {
          const sorted = pendingFinalize.sort((a, b) => a - b);
          let insertions = 0;
          if (sorted.length > 20) {
            const prevLen = sortedArr.length;
            const newSorted = [...sortedArr, ...sorted].sort((a, b) => a - b);
            // unique (sorted, so cheap linear pass)
            const unique = [];
            for (let i = 0; i < newSorted.length; i++) {
              if (i === 0 || newSorted[i] !== newSorted[i - 1]) unique.push(newSorted[i]);
            }
            if (unique.length > prevLen) {
              insertions = unique.length - prevLen;
              sortedArr = unique;
            }
          } else {
            // binary insert small batches
            sorted.forEach(x => {
              let lo = 0, hi = sortedArr.length - 1, found = false;
              while (lo <= hi) {
                const mid = (lo + hi) >> 1;
                if (sortedArr[mid] === x) { found = true; break; }
                if (sortedArr[mid] < x) lo = mid + 1; else hi = mid - 1;
              }
              if (!found) { sortedArr.splice(lo, 0, x); insertions++; }
            });
          }
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
      case 'setPivot': dispatch(setPivot(e.index)); break;
      case 'finalizeAll': {
        if (algorithm === 'quickSort') dispatch(setPivot(null));
        const arr = getState().array;
        sortedArr = arr.map((_, i) => i);
        pendingFinalize = [];
        dispatch(setCurrentSorted(sortedArr.slice()));
        break;
      }
      default: break;
    }
  });

  activeQueue.load(runners);

  // Commit remaining finalizations on completion
  const originalOnComplete = activeQueue.onComplete;
  activeQueue.onComplete = () => {
    if (pendingFinalize.length) {
      pendingFinalize.sort((a, b) => a - b).forEach(x => {
        let lo = 0, hi = sortedArr.length - 1, found = false;
        while (lo <= hi) { const mid = (lo + hi) >> 1; if (sortedArr[mid] === x) { found = true; break; } if (sortedArr[mid] < x) lo = mid + 1; else hi = mid - 1; }
        if (!found) sortedArr.splice(lo, 0, x);
      });
      dispatch(setCurrentSorted(sortedArr.slice()));
    }
    originalOnComplete && originalOnComplete();
  };

  activeQueue.start();
}

// Avoid dispatching identical arrays to reduce React work.
function setArrayIfChanged(dispatch, getState, next) {
  const cur = getState().array;
  if (cur.length !== next.length) { dispatch({ type: 'SET_ARRAY', payload: next }); return; }
  for (let i = 0; i < cur.length; i++) if (cur[i] !== next[i]) { dispatch({ type: 'SET_ARRAY', payload: next }); return; }
  // no change => skip
}

export function getActiveQueue() { return activeQueue; }
