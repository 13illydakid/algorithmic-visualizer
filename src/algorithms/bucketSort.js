// Pure event generator for Bucket Sort.
// Events:
//  bucketPhase { bucketIndex }
//  highlightCompare { indices:[i,j] } (inside bucket insertion passes)
//  performSwap { indices:[i,j], array:[...] } (logical swap inside global view)
//  arrayUpdate { array:[...] } (after finishing a bucket or swap)
//  finalizeElement { index }
//  finalizeAll { array:[...] }

function bucketSort(stateArray) {
  const input = stateArray.slice();
  const events = [];
  const n = input.length;
  if (n <= 1) {
    if (n === 1) {
      events.push({ type: 'finalizeElement', index: 0 });
      events.push({ type: 'finalizeAll', array: input.slice() });
    }
    return { events, finalArray: input.slice() };
  }
  const min = Math.min(...input);
  const max = Math.max(...input);
  const bucketCount = Math.floor(Math.sqrt(n)) || 1;
  const bucketSize = Math.ceil((max - min + 1) / bucketCount);
  const buckets = Array.from({ length: bucketCount }, () => []);
  input.forEach(num => {
    const idx = Math.min(bucketCount - 1, Math.floor((num - min) / bucketSize));
    buckets[idx].push(num);
  });
  let global = [];
  for (let b = 0; b < bucketCount; b++) {
    events.push({ type: 'bucketPhase', bucketIndex: b });
    insertionSortBucket(buckets[b], global.length, events);
    global.push(...buckets[b]);
    events.push({ type: 'arrayUpdate', array: global.slice() });
  }
  for (let i = 0; i < global.length; i++) {
    events.push({ type: 'finalizeElement', index: i });
  }
  events.push({ type: 'finalizeAll', array: global.slice() });
  return { events, finalArray: global };
}

function insertionSortBucket(bucket, offset, events) {
  for (let i = 1; i < bucket.length; i++) {
    let j = i;
    while (j > 0 && bucket[j] < bucket[j - 1]) {
      events.push({ type: 'highlightCompare', indices: [j + offset, j - 1 + offset] });
      [bucket[j], bucket[j - 1]] = [bucket[j - 1], bucket[j]];
      events.push({ type: 'performSwap', indices: [j + offset, j - 1 + offset] });
      j--;
    }
  }
}

export default bucketSort;
