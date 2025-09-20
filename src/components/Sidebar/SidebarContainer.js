import { connect } from "react-redux";
import Sidebar from "./Sidebar";
import { setAlgorithm } from "../../reducers/algorithm";
import { setRunning } from "../../reducers/running";
import { setCurrentSorted } from "../../reducers/sorted";
import { setArray } from "../../reducers/array";
import store from "../../store";
import { computeDelay } from "../../utils/speedMapping";
import bubbleSort from "../../algorithms/bubbleSort";
import quickSort from "../../algorithms/quickSort";
import heapSort from "../../algorithms/heapSort";
import mergeSort from "../../algorithms/mergeSort";
import selectionSort from "../../algorithms/selectionSort";
import insertionSort from "../../algorithms/insertionSort";
import bucketSort from "../../algorithms/bucketSort";
import countingSort from "../../algorithms/countingSort";
import radixSort from "../../algorithms/radixSort";
import shellSort from "../../algorithms/shellSort";
import { setCurrentBubbleTwo } from "../../reducers/bubbleSort";
import { setCurrentQuickTwo, setPivot } from "../../reducers/quickSort";
import { setCurrentSwappers } from "../../reducers/swappers";
import { setCurrentMergeX } from "../../reducers/mergeSort";
import { setCurrentHeapThree } from "../../reducers/heapSort";
import { setCurrentInsertion } from "../../reducers/insertionSort";
import { selectionSort as selectionSortState, selectionSortPivot } from "../../reducers/selectionSort";
import { setShellGap, setShellIndices } from "../../reducers/shellSort";
import { setCurrentBucket } from "../../reducers/bucketSort";
import { setCurrentCountIndex } from "../../reducers/countingSort";
import { incComparisons, incSwaps } from "../../reducers/stats";

const SORT_MAP = { bubbleSort, quickSort, heapSort, mergeSort, selectionSort, insertionSort, bucketSort, countingSort, radixSort, shellSort };

const mapStateToProps = (state) => ({
  algorithm: state.algorithm,
  array: state.array,
  speed: state.speed,
  isRunning: state.isRunning,
});

const mapDispatchToProps = (dispatch) => ({
  updateAlgorithm: (algorithm) => dispatch(setAlgorithm(algorithm)),
  sortFromInfo: (algorithm, array, speed) => {
    const fn = SORT_MAP[algorithm];
    if (!fn) return;
    dispatch(setCurrentSorted([]));
    dispatch(setRunning(true));
    let lastProgressTs = 0;
    const { events } = fn(array);
    // simple inline play (duplicated from toolbar central logic subset)
    let idx = 0;
    function step() {
      if (idx >= events.length) { dispatch(setRunning(false)); return; }
      const e = events[idx++];
      // capture current delay based on (possibly updated) speed each iteration
      const delay = computeDelay(store.getState().speed);
      switch (e.type) {
        case 'highlightCompare': {
          if (algorithm === 'bubbleSort') dispatch(setCurrentBubbleTwo(e.indices));
          else if (algorithm === 'quickSort') dispatch(setCurrentQuickTwo(e.indices));
          else if (algorithm === 'mergeSort') dispatch(setCurrentMergeX(e.indices));
          else if (algorithm === 'heapSort') dispatch(setCurrentHeapThree(e.indices));
          else if (algorithm === 'insertionSort') dispatch(setCurrentInsertion(e.indices));
          else if (algorithm === 'selectionSort') { const [m, j] = e.indices; dispatch(selectionSortPivot(m)); dispatch(selectionSortState([m, j])); }
          else if (algorithm === 'shellSort') dispatch(setShellIndices(e.indices));
          dispatch(incComparisons());
          break;
        }
        case 'performSwap': {
          dispatch(setCurrentSwappers(e.indices));
          if (e.array) dispatch(setArray(e.array));
          dispatch(incSwaps());
          setTimeout(() => dispatch(setCurrentSwappers([])), delay * 0.6);
          break;
        }
        case 'arrayUpdate': dispatch(setArray(e.array)); break;
        case 'bucketPhase': dispatch(setCurrentBucket(e.bucketIndex)); break;
        case 'countingTick': dispatch(setCurrentCountIndex(e.value)); break;
        case 'gapUpdate': dispatch(setShellGap(e.gap)); break;
        case 'finalizeElement': {
          const cur = store.getState().currentSorted || [];
          if (!cur.includes(e.index)) dispatch(setCurrentSorted([...cur, e.index].sort((a, b) => a - b)));
          break;
        }
        case 'setPivot': dispatch(setPivot(e.index)); break;
        case 'finalizeAll': {
          const arr = store.getState().array; dispatch(setCurrentSorted(arr.map((_, i) => i))); break;
        }
        default: break;
      }
      // progress update throttle 200ms
      const now = Date.now();
      if (now - lastProgressTs >= 200) {
        lastProgressTs = now;
        const st = store.getState();
        const total = st.array.length || 1;
        const sorted = (st.currentSorted || []).length;
        const pct = Math.min(100, Math.round((sorted / total) * 100));
        dispatch({ type: 'SET_PROGRESS', payload: pct });
      }
      setTimeout(step, delay);
    }
    step();
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
