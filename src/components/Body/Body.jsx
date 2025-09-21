import { Component } from "react";
import "./Body.css";

class Body extends Component {
  render() {
    const {
      array,
      algorithm,
      // All algorithm states
      currentBubbleTwo,
      currentHeapThree,
      currentMergeX,
      currentQuickTwo,
      currentSorted,
      currentSwappers,
      pivot,
      shellGap,
      shellIndices,
      // Missing algorithm states - now added
      insertionSortReducer,
      selectionSort,
      selectionSortPivot,
      currentBucket,
      bucketAssignments,
      currentCountIndex,
      currentOutputIndex,
    } = this.props;

    // Responsive sizing using CSS variables rather than inline for width/margin
    const containerWidth = document.documentElement.clientWidth;
    const barGap =
      array.length > 120
        ? 1
        : array.length > 80
        ? 2
        : array.length > 40
        ? 3
        : 4;
    const barWidth = Math.max(
      4,
      Math.floor(
        (containerWidth - array.length * barGap * 2 - 120) / array.length
      )
    );

    const barStyleVars = {
      "--bar-gap": barGap + "px",
      "--bar-width": barWidth + "px",
    };

    return (
      <div
        id="bodyContainer"
        style={barStyleVars}
        role="region"
        aria-label="Sorting visualization"
      >
        {(() => {
          if (!array.length) return null;

          // Consolidated algorithm state sets for efficient rendering
          const compareIndices = new Set([
            ...currentBubbleTwo,
            ...currentQuickTwo,
            ...currentHeapThree,
            ...currentMergeX,
            ...(insertionSortReducer || []),
            ...(selectionSort || []),
            ...(shellIndices || [])
          ]);

          const swapSet = new Set(currentSwappers);
          const sortedSet = new Set(currentSorted);
          const shellSet = new Set(shellIndices || []);
          const insertionSet = new Set(insertionSortReducer || []);
          const selectionSet = new Set(selectionSort || []);
          const bucketSet = currentBucket !== null ? new Set([currentBucket]) : new Set();
          const countingSet = currentCountIndex !== null ? new Set([currentCountIndex]) : new Set();

          return array.map((number, index) => {
            const isCompare = compareIndices.has(index);
            const isSwap = swapSet.has(index);
            const isSorted = sortedSet.has(index);
            const isPivot = pivot === index || selectionSortPivot === index;
            const isShellFocus = shellSet.has(index);
            const isInsertionFocus = insertionSet.has(index);
            const isSelectionFocus = selectionSet.has(index);
            const isBucketFocus = bucketSet.has(index);
            const isCountingFocus = countingSet.has(index);

            const classNames = ['bar'];
            if (isCompare) classNames.push('compare');
            if (isSwap) classNames.push('swap');
            if (isSorted) classNames.push('sorted');
            if (isPivot) classNames.push('pivot');
            if (isShellFocus) classNames.push('shell-focus');
            if (isInsertionFocus) classNames.push('insertion-focus');
            if (isSelectionFocus) classNames.push('selection-focus');
            if (isBucketFocus) classNames.push('bucket-focus');
            if (isCountingFocus) classNames.push('counting-focus');

            return (
              <div
                key={index}
                className={classNames.join(' ')}
                style={{ height: number * 3 + 'px' }}
                aria-label={`Value ${number}${isPivot ? ' pivot' : ''}${isSorted ? ' sorted' : ''}${isInsertionFocus ? ' insertion' : ''}${isSelectionFocus ? ' selection' : ''}${isBucketFocus ? ' bucket' : ''}${isCountingFocus ? ' counting' : ''}`}
                data-gap={shellGap || undefined}
                data-algorithm={algorithm || undefined}
              >
                {barWidth > 18 ? (
                  <span style={{ fontSize: barWidth > 40 ? 12 : 10 }}>{number}</span>
                ) : null}
              </div>
            );
          });
        })()}
      </div>
    );
  }
}

export default Body;
