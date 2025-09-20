// Pure event generator: Insertion Sort
// Events:
//  highlightCompare { indices:[i,j] }
//  performSwap { indices:[i,j], array:[...] }
//  finalizeElement { index }
//  finalizeAll { array:[...] }

function insertionSort(stateArray) {
  const arr = stateArray.slice();
  const events = [];
  if (arr.length === 0) return { events: [], finalArray: [] };
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0) {
      events.push({ type: 'highlightCompare', indices: [j, j - 1] });
      if (arr[j] < arr[j - 1]) {
        // swap
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
        events.push({ type: 'performSwap', indices: [j, j - 1], array: arr.slice() });
        j--;
      } else {
        break;
      }
    }
    // We can optionally finalize the element at i (stable growth of sorted prefix)
    events.push({ type: 'finalizeElement', index: i });
  }
  // Ensure first element considered finalized
  events.push({ type: 'finalizeElement', index: 0 });
  events.push({ type: 'finalizeAll', array: arr.slice() });
  return { events, finalArray: arr };
}

export default insertionSort;
