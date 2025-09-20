// Pure event generator for Heap Sort.
// Event types:
//  highlightCompare { indices:[i,j] } (compare parent vs candidate child)
//  performSwap      { indices:[i,j], array:[...] }
//  finalizeElement  { index }
//  finalizeAll      { array:[...] }

function heapSort(stateArray) {
  const arr = stateArray.slice();
  const events = [];
  buildMaxHeap(arr, events);
  let end = arr.length - 1;
  while (end > 0) {
    // swap root with end
    events.push({ type: 'performSwap', indices: [0, end], array: swapAndSnapshot(arr, 0, end) });
    events.push({ type: 'finalizeElement', index: end });
    siftDown(arr, 0, end, events);
    end--;
  }
  if (end === 0) events.push({ type: 'finalizeElement', index: 0 });
  events.push({ type: 'finalizeAll', array: arr.slice() });
  return { events, finalArray: arr };
}

function buildMaxHeap(array, events) {
  let i = Math.floor(array.length / 2);
  while (i >= 0) {
    siftDown(array, i, array.length, events);
    i--;
  }
}

function siftDown(array, start, end, events) {
  if (start >= Math.floor(end / 2)) return; // leaf
  const left = start * 2 + 1;
  const right = start * 2 + 2 < end ? start * 2 + 2 : null;
  let swapIndex;
  if (right !== null) {
    events.push({ type: 'highlightCompare', indices: [start, left, right] }); // three indices (parent + both children)
    swapIndex = array[left] > array[right] ? left : right;
  } else {
    events.push({ type: 'highlightCompare', indices: [start, left] });
    swapIndex = left;
  }
  if (array[start] < array[swapIndex]) {
    events.push({ type: 'performSwap', indices: [start, swapIndex], array: swapAndSnapshot(array, start, swapIndex) });
    siftDown(array, swapIndex, end, events);
  }
}

function swapAndSnapshot(array, i, j) {
  const tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
  return array.slice();
}

export default heapSort;
