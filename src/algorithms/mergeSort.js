// Pure event generator for Merge Sort.
// Event types used:
//  highlightCompare { indices:[i,j] }
//  performSwap       { indices:[i,j], array:[...] }   (conceptual: when right element moves ahead)
//  finalizeElement   { index }
//  finalizeAll       { array:[...] }
//  highlightRange    { range:[start,end] } (optional for visual grouping)

function mergeSort(stateArray) {
  const working = stateArray.slice();
  const events = [];
  const annotated = working.map((v, i) => [v, i]);
  const ctx = { array: working.slice() };
  mergeSortRecursive(annotated, events, 0, working.length - 1, ctx, working.length);
  events.push({ type: 'finalizeAll', array: ctx.array.slice() });
  return { events, finalArray: ctx.array.slice() };
}

function mergeSortRecursive(array, events, start, end, ctx, totalLength) {
  // Base cases: empty or single element subarray
  if (array.length <= 1 || start > end) return array;
  const half = Math.floor(array.length / 2);
  const first = array.slice(0, half);
  const second = array.slice(half);
  const midIndex = Math.floor((end + 1 + start) / 2);
  const left = mergeSortRecursive(first, events, start, midIndex - 1, ctx, totalLength);
  const right = mergeSortRecursive(second, events, midIndex, end, ctx, totalLength);
  const isFinalMerge = (left.length + right.length === totalLength);
  return mergeAndEmit(left, right, events, ctx, start, end, isFinalMerge);
}

function mergeAndEmit(left, right, events, ctx, start, end, isFinalMerge) {
  const merged = [];
  let insertionIndex = start;
  while (left.length && right.length) {
    events.push({ type: 'highlightCompare', indices: [left[0][1], right[0][1]] });
    if (left[0][0] <= right[0][0]) {
      insertionIndex++;
      merged.push(left.shift());
    } else {
      // right element moves ahead of left[0]
      events.push({ type: 'performSwap', indices: [left[0][1], right[0][1]] });
      right[0][1] = insertionIndex++;
      merged.push(right.shift());
      left.forEach(item => item[1]++); // shift indices for remaining left segment
      ctx.array = rebuildArray(ctx.array, merged, left, right, start, end);
      events.push({ type: 'arrayUpdate', array: ctx.array.slice() });
    }
    if (isFinalMerge) {
      events.push({ type: 'finalizeElement', index: insertionIndex - 1 });
    }
  }
  return merged.concat(left).concat(right);
}

function rebuildArray(base, merged, left, right, start, end) {
  return base.slice(0, start)
    .concat(merged.map(x => x[0]))
    .concat(left.map(x => x[0]))
    .concat(right.map(x => x[0]))
    .concat(base.slice(end + 1));
}

export default mergeSort;
