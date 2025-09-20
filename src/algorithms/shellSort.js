// Pure event generator for Shell Sort
// Events:
//  gapUpdate { gap }
//  highlightCompare { indices:[i,j] }
//  performSwap { indices:[i,j], array:[...] }
//  arrayUpdate { array:[...] }
//  finalizeElement { index }
//  finalizeAll { array:[...] }

function shellSort(stateArray) {
  const arr = stateArray.slice();
  const events = [];
  const n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    events.push({ type: 'gapUpdate', gap });
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      events.push({ type: 'highlightCompare', indices: [i, i - gap] });
      while (j >= gap && arr[j - gap] > temp) {
        events.push({ type: 'highlightCompare', indices: [j, j - gap] });
        arr[j] = arr[j - gap];
        events.push({ type: 'arrayUpdate', array: arr.slice() });
        j -= gap;
      }
      arr[j] = temp;
      events.push({ type: 'arrayUpdate', array: arr.slice() });
    }
  }
  for (let i = 0; i < n; i++) {
    events.push({ type: 'finalizeElement', index: i });
  }
  events.push({ type: 'finalizeAll', array: arr.slice() });
  return { events, finalArray: arr };
}

export default shellSort;
