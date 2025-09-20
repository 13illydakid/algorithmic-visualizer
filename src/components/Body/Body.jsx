import React, { Component } from "react";
import "./Body.css";

class Body extends Component {
  render() {
    const {
      array,
      currentBubbleTwo,
      currentHeapThree,
      currentMergeX,
      currentQuickTwo,
      currentSorted,
      currentSwappers,
      pivot,
      shellGap,
      shellIndices,
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
        {array.length
          ? array.map((number, index) => {
              const isCompare =
                currentBubbleTwo.includes(index) ||
                currentQuickTwo.includes(index) ||
                currentHeapThree.includes(index) ||
                currentMergeX.includes(index);
              const isSwap = currentSwappers.includes(index);
              const isSorted = currentSorted.includes(index);
              const isPivot = pivot === index;
              const isShellFocus =
                shellIndices &&
                shellIndices.includes &&
                shellIndices.includes(index);

              const classNames = ["bar"];
              if (isCompare) classNames.push("compare");
              if (isSwap) classNames.push("swap");
              if (isSorted) classNames.push("sorted");
              if (isPivot) classNames.push("pivot");
              if (isShellFocus) classNames.push("shell-focus");

              return (
                <div
                  key={index}
                  className={classNames.join(" ")}
                  style={{ height: number * 3 + "px" }}
                  aria-label={`Value ${number}${isPivot ? " pivot" : ""}${
                    isSorted ? " sorted" : ""
                  }`}
                  data-gap={shellGap || undefined}
                >
                  {barWidth > 18 ? (
                    <span style={{ fontSize: barWidth > 40 ? 12 : 10 }}>
                      {number}
                    </span>
                  ) : null}
                </div>
              );
            })
          : null}
      </div>
    );
  }
}

export default Body;
