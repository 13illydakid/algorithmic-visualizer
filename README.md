## Algorithmic Visualizer

An accessible, theme-driven React + Redux application for exploring and comparing sorting algorithms in real time. Recently redesigned with a liquid retina aesthetic, centralized event-driven animation system, pause/resume control, and live performance statistics.

### Toolbar Redesign (Sept 2025)

The control surface has been refactored for density + clarity:

- Semi‑circle speed gauge (baseline aligned) mapping 1x → 20x linearly across 180°.
- Array Size pill control (compact +/- buttons + track fill) minimizing vertical footprint.
- Animated metric chips (comparisons, swaps, EPS, ETA, progress) with subtle pulse on change.
- Turbo toggle & pause/resume co-located for quicker interaction.
- Theme toggle (dark / light) powered by CSS custom property layers; smooth transitions.
- Reduced-motion support auto-respects `prefers-reduced-motion` (suppresses pulses & spins).
- Accessibility: live status chips (`aria-live=polite`), descriptive buttons, high-contrast focus ring.

All styling leverages a small set of semantic variables in `theme.css` to enable rapid future theme variants.

### Key Features

- Unified event queue (pausable / resumable) for all algorithms
- Centralized sort runner to prevent duplicated playback logic (improves consistency & performance)
- Adaptive batching of finalize events to avoid late-stage slowdowns
- Turbo mode for thinning compare events on very large sequences
### Recent Performance Fix (Sept 2025)

An issue where playback began fast then degraded over time (sometimes never finishing) was resolved by:

1. Removing a duplicated inline event loop in `SidebarContainer` that competed with the main queue.
2. Consolidating all sorting playback logic into `src/utils/sortRunner.js` to ensure a single DispatchQueue drives state changes.
3. Eliminating per-frame `console.log` calls in the array rendering path.
4. Adding array identity checks to skip redundant `SET_ARRAY` dispatches when the data is unchanged.
5. Improving finalize batching logic to reduce Redux churn in later phases of a sort.

Run a production build to benchmark:

```
npm run build
```

Then serve `src/public` (or the build output depending on your deployment setup) with any static server.

- Rich set of algorithms: Bubble, Quick, Merge, Heap, Insertion, Selection, Shell, Counting, Bucket, Radix
- Structured event taxonomy (compare, swap, pivot, gap, counting, bucket, digit phase, array updates, finalization)
- Live stats: comparison and swap counters
- Status bar & legend for instantaneous semantic context
- Theming via CSS custom properties (easily extendable)
- Accessible controls (ARIA-friendly, reduced motion friendly approach possible)

### Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm start
```

Visit http://localhost:3000.

### Scripts

```bash
npm start      # dev server
npm test       # jest tests
npm run build  # production bundle
```

### Architecture Overview

| Concern          | Approach                                                                          |
| ---------------- | --------------------------------------------------------------------------------- |
| State Management | Redux slices per algorithm highlight + core slices (array, stats, speed, paused)  |
| Animation        | Single `DispatchQueue` consuming generated event lists                            |
| Algorithms       | Pure functions returning `{ events, finalArray }` (no side effects)               |
| Events           | Plain objects describing intent; playback interprets & dispatches reducers        |
| Styling          | CSS custom properties + glass / depth effects                                     |
| Accessibility    | Semantic buttons, status region (`role="status"`), planned reduced-motion toggles |

### Event Types

| Type             | Purpose                                                     | Typical Fields              |
| ---------------- | ----------------------------------------------------------- | --------------------------- |
| highlightCompare | Visual compare; increments comparisons                      | indices:[i,j]               |
| performSwap      | Swap two elements; increments swaps                         | indices:[i,j], array:[...]? |
| arrayUpdate      | Non-swap structural update (merge/shell/count/radix/bucket) | array:[...]                 |
| finalizeElement  | Mark one index as sorted                                    | index                       |
| finalizeAll      | Mark entire array sorted                                    | array:[...]                 |
| setPivot         | Quick sort pivot highlight                                  | index                       |
| gapUpdate        | Shell sort current gap                                      | gap                         |
| countingTick     | Counting/radix digit frequency highlight                    | value                       |
| bucketPhase      | Active bucket focus                                         | bucketIndex                 |
| digitPhase       | Radix current exponent (10^k)                               | exp                         |

### Adding a New Sorting Algorithm

1. Create `src/algorithms/yourSort.js` exporting `function yourSort(array) { return { events, finalArray }; }`.
2. Generate events instead of dispatching Redux actions directly.
3. Add the function to `SORT_MAP` in `ToolbarContainer.js` & metadata (if you maintain an algorithm registry file).
4. (Optional) Add new event type handling in the `playCentral` switch if needed.
5. Update legend/status bar if the algorithm introduces new semantic states.

Minimal template:

```js
export default function cocktailSort(input) {
  const arr = input.slice();
  const events = [];
  let swapped = true,
    start = 0,
    end = arr.length - 1;
  while (swapped) {
    swapped = false;
    for (let i = start; i < end; i++) {
      events.push({ type: "highlightCompare", indices: [i, i + 1] });
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        events.push({
          type: "performSwap",
          indices: [i, i + 1],
          array: arr.slice(),
        });
        swapped = true;
      }
    }
    events.push({ type: "finalizeElement", index: end });
    end--;
    if (!swapped) break;
    swapped = false;
    for (let i = end; i > start; i--) {
      events.push({ type: "highlightCompare", indices: [i - 1, i] });
      if (arr[i - 1] > arr[i]) {
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        events.push({
          type: "performSwap",
          indices: [i - 1, i],
          array: arr.slice(),
        });
        swapped = true;
      }
    }
    events.push({ type: "finalizeElement", index: start });
    start++;
  }
  for (let i = start; i <= end; i++)
    events.push({ type: "finalizeElement", index: i });
  events.push({ type: "finalizeAll", array: arr.slice() });
  return { events, finalArray: arr };
}
```

### Pause / Resume Mechanics

`DispatchQueue` maintains a cursor over event runners. The global `paused` slice gates scheduling; toggling pause simply halts further timeouts without losing position.

### Stats Semantics

- Comparisons: Count only `highlightCompare` (value-to-value checks)
- Swaps: Count only `performSwap` (logical position exchanges)
  Non-comparison sorts (Counting, Radix, Bucket final placement) will often show low or zero swap counts—this is expected.

### Theming

Customize CSS variables (e.g. in `theme.css`) to reskin gradients, bar colors, depth effects. Legend chips reference semantic variables: `--compare-color`, `--swap-color`, etc.

### Accessibility & Future Enhancements

- Add reduced motion mode to skip animations by immediate array updates.
- Provide keyboard focus outlines and roving tab index for algorithm selection.
- Expose screen-reader friendly narration for major phase events (digitPhase, bucketPhase, gapUpdate).
- Add granular user setting for comparison thinning thresholds in Turbo mode.
- Persist user theme & speed preferences (currently theme persisted via localStorage).

### Directory Highlights

| Path                         | Purpose                                       |
| ---------------------------- | --------------------------------------------- |
| `src/algorithms/*`           | Pure event-generating sorting implementations |
| `src/utils/dispatchQueue.js` | Central pausable queue                        |
| `src/components/Status/`     | Status bar & legend UI                        |
| `src/reducers/*`             | Redux slices                                  |

### Contributing

1. Fork & branch.
2. Add / modify algorithm (follow event contract).
3. Ensure no direct timeouts inside algorithms.
4. Provide tests for new logic if complexity increases.

### License

MIT

---

Generated: Modernized from original CRA scaffold to an event-driven visualization platform.
