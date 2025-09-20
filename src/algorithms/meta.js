// Central metadata for algorithms used to drive UI (Sidebar + Info panels)
// Each entry: id (store key / reducer naming), label (UI), stable, inPlace, description (short), complexities

const algorithmsMeta = [
  {
    id: 'bubbleSort',
    label: 'Bubble Sort',
    stable: true,
    inPlace: true,
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    complexity: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' }
  },
  {
    id: 'selectionSort',
    label: 'Selection Sort',
    stable: false,
    inPlace: true,
    description: 'Selects the minimum element from the unsorted portion and places it at the beginning.',
    complexity: { best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' }
  },
  {
    id: 'insertionSort',
    label: 'Insertion Sort',
    stable: true,
    inPlace: true,
    description: 'Builds the final sorted array one element at a time by inserting elements into their correct position.',
    complexity: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' }
  },
  {
    id: 'mergeSort',
    label: 'Merge Sort',
    stable: true,
    inPlace: false,
    description: 'Divides the array into halves, sorts each, then merges them producing a stable, predictable performance.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' }
  },
  {
    id: 'quickSort',
    label: 'Quick Sort',
    stable: false,
    inPlace: true,
    description: 'Partitions the array around a pivot placing it in final position, then recursively sorts partitions.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)', space: 'O(log n)' }
  },
  {
    id: 'heapSort',
    label: 'Heap Sort',
    stable: false,
    inPlace: true,
    description: 'Builds a max-heap and repeatedly extracts the maximum placing it at the end.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' }
  },
  {
    id: 'bucketSort',
    label: 'Bucket Sort',
    stable: true,
    inPlace: false,
    description: 'Distributes elements into buckets, sorts each bucket (often via insertion sort), then concatenates.',
    complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n^2)', space: 'O(n + k)' }
  },
  {
    id: 'countingSort',
    label: 'Counting Sort',
    stable: true,
    inPlace: false,
    description: 'Counts occurrences of each distinct value to determine positions directly without comparisons.',
    complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)', space: 'O(k)' }
  },
  {
    id: 'radixSort',
    label: 'Radix Sort',
    stable: true,
    inPlace: false,
    description: 'Processes digits from least to most significant applying a stable counting sort per digit.',
    complexity: { best: 'O(d(n + k))', average: 'O(d(n + k))', worst: 'O(d(n + k))', space: 'O(n + k)' }
  },
  {
    id: 'shellSort',
    label: 'Shell Sort',
    stable: false,
    inPlace: true,
    description: 'Generalization of insertion sort that allows exchanges of items far apart using diminishing gaps.',
    complexity: { best: 'O(n log n)', average: 'O(n^(3/2)) ~ depends on gaps', worst: 'O(n^2)', space: 'O(1)' }
  }
];

export default algorithmsMeta;
