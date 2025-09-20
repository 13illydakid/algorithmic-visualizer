import "./QuickInfo.css";

function QuickInfo() {

  return (
    <div>
      <p>
      <b>QuickSort</b> is a sorting algorithm based on the Divide and Conquer that picks an element as a pivot and partitions the given array around the picked pivot by placing the pivot in its correct position in the sorted array.
      <br /><br />
      It works on the principle of <b>divide and conquer</b>, breaking down the problem into smaller sub-problems.
      </p>
      <h4><b>How does QuickSort work?</b></h4>
      <ol className="ordered-list">
        <li>
          <i><b>Choose a Pivot:</b> Select an element from the array as the pivot. The choice of pivot can vary (e.g., first element, last element, random element, or median).</i>
        </li>
        <li>
          <i><b>Partition the Array:</b> Rearrange the array around the pivot. After partitioning, all elements smaller than the pivot will be on its left, and all elements greater than the pivot will be on its right. The pivot is then in its correct position, and we obtain the index of the pivot.</i>
        </li>
        <li>
          <i><b>Recursively Call:</b> Recursively apply the same process to the two partitioned sub-arrays (left and right of the pivot).</i>
        </li>
        <li>
          <i><b>Base Case:</b> The recursion stops when there is only one element left in the sub-array, as a single element is already sorted.</i>
        </li>
      </ol>

    </div>
  );
}

export default QuickInfo;
