import React from "react";
import algorithmsMeta from "../../algorithms/meta";
import "./AlgorithmInfo.css";

// Rich descriptive copy keyed by algorithm id
const descriptions = {
  bubbleSort: {
    intro:
      "Bubble Sort repeatedly scans the list, swapping adjacent elements that are out of order. After each full pass, the largest remaining element “bubbles” to its final position at the end.",
    notes: [
      "Adaptive best case when the list is already sorted (can be O(n) with early exit).",
      "Stable and in-place, but rarely used in production due to quadratic average time.",
    ],
  },
  selectionSort: {
    intro:
      "Selection Sort partitions the array into a sorted prefix and unsorted suffix. Each iteration selects the minimum from the unsorted portion and swaps it to the boundary.",
    notes: [
      "Always O(n²) comparisons regardless of order.",
      "Unstable by default (can be made stable with extra memory).",
    ],
  },
  insertionSort: {
    intro:
      "Insertion Sort builds a sorted portion one element at a time by inserting each new element into its correct spot relative to those already processed.",
    notes: [
      "Excellent for nearly-sorted / small arrays.",
      "Stable and in-place; often used inside hybrid algorithms (e.g., TimSort).",
    ],
  },
  mergeSort: {
    intro:
      "Merge Sort divides the array into halves, recursively sorts each half, and then merges the sorted halves. Its divide-and-conquer structure guarantees O(n log n) time.",
    notes: [
      "Stable, predictable performance even in worst case.",
      "Requires O(n) auxiliary space for merging.",
    ],
  },
  quickSort: {
    intro:
      "Quick Sort partitions the array around a pivot, placing the pivot into its final position, then recursively sorts the left and right partitions.",
    notes: [
      "Average O(n log n) but worst-case O(n²) if pivots are poor (e.g., already sorted with naive pivot choice).",
      "In-place with good cache locality; typically fastest comparison sort in practice.",
    ],
  },
  heapSort: {
    intro:
      "Heap Sort first builds a max-heap, then repeatedly extracts the maximum (root) and re-heapifies the remaining elements.",
    notes: [
      "Guarantees O(n log n) time without extra large auxiliary arrays.",
      "Not stable; involves non-sequential memory access versus merge sort.",
    ],
  },
  bucketSort: {
    intro:
      "Bucket Sort distributes elements into a set of buckets based on value ranges, sorts each bucket (often via insertion sort), then concatenates them.",
    notes: [
      "Effective when input is uniformly distributed over a known range.",
      "Performance degrades if distribution is highly skewed.",
    ],
  },
  countingSort: {
    intro:
      "Counting Sort tallies occurrences of each distinct value, then performs a prefix sum to compute final positions. It avoids comparisons entirely.",
    notes: [
      "Runs in O(n + k), where k is the value range.",
      "Stable and forms a building block for Radix Sort.",
    ],
  },
  radixSort: {
    intro:
      "Radix Sort processes digits from least (or most) significant to most significant, applying a stable digit-level sort (often counting sort) each pass.",
    notes: [
      "Breaks comparison-based lower bound for integers by leveraging digit structure.",
      "Complexity depends on digit count and base: O(d*(n + k)).",
    ],
  },
  shellSort: {
    intro:
      "Shell Sort generalizes insertion sort by first comparing elements far apart using a diminishing gap sequence, dramatically reducing required shifts.",
    notes: [
      "Performance depends on chosen gap sequence (common: n/2, n/4, …, 1).",
      "Not stable; can approach O(n log² n) or better with advanced sequences.",
    ],
  },
};

const AlgorithmInfo = ({ id, onSort, canSort, isRunning }) => {
  const meta = algorithmsMeta.find((a) => a.id === id);
  if (!meta) return null;
  const copy = descriptions[id];
  return (
    <div
      className="algo-info"
      role="article"
      aria-labelledby={`algo-title-${id}`}
    >
      <div className="algo-info-header-row">
        <h2 id={`algo-title-${id}`}>{meta.label}</h2>
        {canSort && (
          <button
            className="button-primary algo-info-sort-btn"
            disabled={isRunning}
            onClick={onSort}
            aria-label={`Sort using ${meta.label}`}
          >
            Sort
          </button>
        )}
      </div>
      <p className="intro">{copy?.intro}</p>
      {copy?.notes && (
        <ul className="notes">
          {copy.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
      <div className="metrics-wrapper">
        <table
          className="table-metrics"
          aria-label="Algorithm complexity table"
        >
          <thead>
            <tr>
              <th scope="col">Best</th>
              <th scope="col">Average</th>
              <th scope="col">Worst</th>
              <th scope="col">Space</th>
              <th scope="col">Stable</th>
              <th scope="col">In-Place</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{meta.complexity.best}</td>
              <td>{meta.complexity.average}</td>
              <td>{meta.complexity.worst}</td>
              <td>{meta.complexity.space}</td>
              <td>{meta.stable ? "Yes" : "No"}</td>
              <td>{meta.inPlace ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlgorithmInfo;
