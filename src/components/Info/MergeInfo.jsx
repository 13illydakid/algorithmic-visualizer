import "./MergeInfo.css";

function MergeInfo() {

  return (
    <div>
      <p>
      <b>Merge sort</b> is a sorting algorithm that follows the divide-and-conquer approach. It works by recursively dividing the input array into smaller subarrays and sorting those subarrays then merging them back together to obtain the sorted array.
      <br /><br />
      In simple terms, we can say that the process of <b>merge sort</b> is to divide the array into two halves, sort each half, and then merge the sorted halves back together. This process is repeated until the entire array is sorted.
      </p>
      <br />
      <h4><b>How does Merge Sort work?</b></h4>
      <p>Merge sort is a popular sorting algorithm known for its efficiency and stability. It follows the <b>divide-and-conquer</b> approach to sort a given array of elements.</p>
      <p>Here's a step-by-step explanation of how merge sort works:</p>
      <ol>
        <li>
          <i><b>Divide:</b> Divide the list or array recursively into two halves until it can no more be divided.</i>
        </li>
        <li>
          <i><b>Conquer:</b> Each subarray is sorted individually using the merge sort algorithm.</i>
        </li>
        <li>
          <i><b>Merge:</b> The sorted subarrays are merged back together in sorted order. The process continues until all elements from both subarrays have been merged.</i>
        </li>
      </ol>

    </div>
  );
}

export default MergeInfo;
