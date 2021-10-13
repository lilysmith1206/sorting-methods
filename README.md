## Sorting Methods
This program generates an array with unique values 0-99, and then sorts it using various sorting methods implemented in Typescript.

## Sorting Types

Bogo Sort: Shuffles array randomly until it is sorted. One of the worst sorting methods, and one of the easiest to implement. Because it's so bad, uses a smaller array to sort.

Counting Sort: Counts the amount of each number in the array, and uses that to place the elements in the new array.

Javascript's Array.sort: Uses the sorting function shown below to calculate placement.
```typescript
(a, b) => (a - b)
``` 
Selection Sort: Gets the lowest value in the array, places it in the new array. Repeats until the old array is empty.

Bubble Sort: Swaps two values if they're not ordered according to the order function.

## Display

The display uses a table and coloured tiles to show the unsorted and sorted arrays, instead of showing the numbers themselves.
