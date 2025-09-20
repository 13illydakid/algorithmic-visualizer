// Pure event generator for Counting Sort.
// Events:
//  countingTick { value } (while counting occurrences)
//  arrayUpdate { array:[...] } (output array as it's built)
//  finalizeElement { index } (when output slot considered done)
//  finalizeAll { array:[...] }

function countingSort(stateArray) {
  const input = stateArray.slice();
  const events = [];
  if (input.length <= 1) {
    if (input.length === 1) {
      events.push({ type: 'finalizeElement', index: 0 });
      events.push({ type: 'finalizeAll', array: input.slice() });
    }
    return { events, finalArray: input.slice() };
  }
  const max = Math.max(...input);
  const count = new Array(max + 1).fill(0);
  for (let i = 0; i < input.length; i++) {
    count[input[i]]++;
    events.push({ type: 'countingTick', value: input[i] });
  }
  for (let i = 1; i < count.length; i++) count[i] += count[i - 1];
  const output = new Array(input.length);
  for (let i = input.length - 1; i >= 0; i--) {
    const v = input[i];
    const pos = count[v] - 1;
    output[pos] = v;
    events.push({ type: 'arrayUpdate', array: output.slice() });
    events.push({ type: 'finalizeElement', index: pos });
    count[v]--;
  }
  events.push({ type: 'finalizeAll', array: output.slice() });
  return { events, finalArray: output };
}

export default countingSort;
