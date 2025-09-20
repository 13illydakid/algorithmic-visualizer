// Pure event generator for Selection Sort
// Events: highlightCompare, performSwap, finalizeElement, finalizeAll

function selectionSort(stateArray) {
  const arr = stateArray.slice();
  const events = [];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      events.push({ type: 'highlightCompare', indices: [minIndex, j] });
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      events.push({ type: 'performSwap', indices: [i, minIndex], array: arr.slice() });
    }
    events.push({ type: 'finalizeElement', index: i });
  }
  if (n > 0) events.push({ type: 'finalizeElement', index: n - 1 });
  events.push({ type: 'finalizeAll', array: arr.slice() });
  return { events, finalArray: arr };
}

export default selectionSort;
