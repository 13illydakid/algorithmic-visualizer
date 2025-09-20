// New event-driven bubble sort. Instead of relying on array-length heuristics,
// we emit explicit event objects. A future central DispatchQueue will consume
// these. For now, we keep a simple local timed drain for backward compatibility.
// Event types:
//  compare: { type: 'compare', indices: [i,j] }
//  swap: { type: 'swap', indices: [i,j], array: [...after swap...] }
//  markSorted: { type: 'markSorted', index }
//  finalizeAll: { type: 'finalizeAll' }

// Pure event generator version of Bubble Sort.
// Returns { events, finalArray }
// Event types:
//  highlightCompare { type:'highlightCompare', indices:[i,j] }
//  performSwap { type:'performSwap', indices:[i,j], array:[...] }
//  finalizeElement { type:'finalizeElement', index }
//  finalizeAll { type:'finalizeAll' }

function bubbleSort(stateArray) {
  const arr = stateArray.slice();
  const events = [];
  let sorted = false;
  let round = 0;
  while (!sorted) {
    sorted = true;
    for (let i = 0; i < arr.length - 1 - round; i++) {
      events.push({ type: 'highlightCompare', indices: [i, i + 1] });
      if (arr[i] > arr[i + 1]) {
        const tmp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = tmp;
        sorted = false;
        events.push({ type: 'performSwap', indices: [i, i + 1], array: arr.slice() });
      }
    }
    events.push({ type: 'finalizeElement', index: arr.length - 1 - round });
    round++;
  }
  events.push({ type: 'finalizeAll', array: arr.slice() });
  return { events, finalArray: arr };
}

export default bubbleSort;
