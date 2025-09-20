// Refactored Quick Sort to emit structured events.
// Event types:
//  setPivot { type:'setPivot', index }
//  highlightCompare { type:'highlightCompare', indices:[i,j] }
//  performSwap { type:'performSwap', indices:[i,j], array:[...] }
//  finalizeElement { type:'finalizeElement', index }
//  finalizeAll { type:'finalizeAll' }

function quickSort(stateArray) {
  const arr = stateArray.slice();
  const events = [];
  buildQuickSortEvents(arr, 0, arr.length - 1, events);
  events.push({ type: 'finalizeAll', array: arr.slice() });
  return { events, finalArray: arr };
}

function buildQuickSortEvents(array, start, end, events) {
  if (start >= end) {
    if (start >= 0 && start < array.length) {
      events.push({ type: 'finalizeElement', index: start });
    }
    return;
  }
  let pivot = start;
  let left = start + 1;
  let right = end;
  events.push({ type: 'setPivot', index: pivot });
  events.push({ type: 'highlightCompare', indices: [left, right] });
  while (right >= left) {
    if (array[right] < array[pivot] && array[left] > array[pivot]) {
      const temp = array[right];
      array[right] = array[left];
      array[left] = temp;
      events.push({ type: 'performSwap', indices: [left, right], array: array.slice() });
    }
    if (array[right] >= array[pivot]) {
      right--;
    }
    if (array[left] <= array[pivot]) {
      left++;
    }
    if (right >= left) {
      events.push({ type: 'highlightCompare', indices: [left, right] });
    }
  }
  events.push({ type: 'highlightCompare', indices: [pivot, right] });
  if (pivot !== right) {
    const temp = array[right];
    array[right] = array[pivot];
    array[pivot] = temp;
    events.push({ type: 'performSwap', indices: [pivot, right], array: array.slice() });
    events.push({ type: 'finalizeElement', index: right });
  } else {
    events.push({ type: 'finalizeElement', index: pivot });
  }
  buildQuickSortEvents(array, start, right - 1, events);
  buildQuickSortEvents(array, right + 1, end, events);
}

export default quickSort;
