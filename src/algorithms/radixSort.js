// Pure event-based radix sort (LSD) using counting per digit.
// Events:
//  digitPhase { exp }
//  countingTick { value: digit }
//  arrayUpdate { array:[...] }
//  finalizeElement { index }
//  finalizeAll { array:[...] }

function radixSort(stateArray) {
  const arr = stateArray.slice();
  const events = [];
  const n = arr.length;
  if (n <= 1) {
    if (n === 1) {
      events.push({ type: 'finalizeElement', index: 0 });
      events.push({ type: 'finalizeAll', array: arr.slice() });
    }
    return { events, finalArray: arr.slice() };
  }
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    events.push({ type: 'digitPhase', exp });
    countingPass(arr, exp, events);
    events.push({ type: 'arrayUpdate', array: arr.slice() });
  }
  for (let i = 0; i < n; i++) {
    events.push({ type: 'finalizeElement', index: i });
  }
  events.push({ type: 'finalizeAll', array: arr.slice() });
  return { events, finalArray: arr };
}

function countingPass(arr, exp, events) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
    events.push({ type: 'countingTick', value: digit });
  }
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    const value = arr[i];
    const digit = Math.floor(value / exp) % 10;
    const pos = --count[digit];
    output[pos] = value;
  }
  for (let i = 0; i < n; i++) arr[i] = output[i];
}

export default radixSort;
