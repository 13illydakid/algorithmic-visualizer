import bubbleSort from './bubbleSort';
import bucketSort from './bucketSort';
import countingSort from './countingSort';
import heapSort from './heapSort';
import insertionSort from './insertionSort';
import mergeSort from './mergeSort';
import quickSort from './quickSort';
import radixSort from './radixSort';
import selectionSort from './selectionSort';
import shellSort from './shellSort';

// List of algorithms to validate
const ALGORITHMS = [
  ['bubbleSort', bubbleSort],
  ['quickSort', quickSort],
  ['heapSort', heapSort],
  ['mergeSort', mergeSort],
  ['selectionSort', selectionSort],
  ['insertionSort', insertionSort],
  ['bucketSort', bucketSort],
  ['countingSort', countingSort],
  ['radixSort', radixSort],
  ['shellSort', shellSort],
];

function genArray(len) {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(Math.floor(Math.random() * 250)); // keep values modest
  }
  return arr;
}

function isSorted(a) {
  for (let i = 1; i < a.length; i++) if (a[i - 1] > a[i]) return false;
  return true;
}

describe('Sorting algorithms correctness', () => {
  test.each(ALGORITHMS)('%s sorts correctly and is pure', (name, fn) => {
    // test multiple sizes including edge cases
    [0, 1, 2, 5, 15, 40].forEach(size => {
      const input = genArray(size);
      const original = input.slice();
      const { events, finalArray } = fn(input);
      // Original must remain unchanged (pure generator)
      expect(input).toEqual(original);
      // finalArray must be sorted
      expect(isSorted(finalArray)).toBe(true);
      // finalArray must be a permutation of original
      const sortedOriginal = original.slice().sort((a, b) => a - b);
      const sortedFinal = finalArray.slice().sort((a, b) => a - b);
      expect(sortedFinal).toEqual(sortedOriginal);
      // Events shape basic sanity (skip size 0/1 where some algorithms emit minimal events)
      if (size > 1) {
        expect(Array.isArray(events)).toBe(true);
        expect(events.length).toBeGreaterThan(0);
        const last = events[events.length - 1];
        expect(last.type).toBe('finalizeAll');
      }
    });
  });

  test('Radix & Counting handle single element', () => {
    const single = [42];
    const { finalArray: r1 } = radixSort(single);
    const { finalArray: r2 } = countingSort(single);
    expect(r1).toEqual(single);
    expect(r2).toEqual(single);
  });
});
