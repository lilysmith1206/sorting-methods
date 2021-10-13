import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SorterService {

  private sortIndex: number = -1;
  public sortInterrupt: boolean = false;

  public methodEmitter = new EventEmitter<string>();
  public arrayEmitter = new EventEmitter<{unsorted: number[], sorted: number[]}>();

  private sortingAlgorithms: {name: string, algorithm: {(arr: number[]): number[]}}[] = [
    {
      name: 'bogo',
      algorithm: (arr) => {  // bogosort

        let shuffledArr: number[] = arr;
        while (!this.sortInterrupt && !this.sorted(shuffledArr)) {
          let tempArr: number[] = [];
          while (shuffledArr.length > 0) {
            const randIndex = Math.floor(Math.random()*shuffledArr.length);
            tempArr.push(shuffledArr[randIndex]);
            shuffledArr.splice(randIndex, 1);
          }
          shuffledArr = tempArr;
        }
        return shuffledArr;
      }
    },
    {
      name: 'counting',
      algorithm: (arr) => { // counting sort
        const max: number = arr.reduce((prev, curr) => prev > curr ? prev : curr);
        let count: number[] = new Array(max + 1);
        const newArr: number[] = new Array(arr.length);

        for (let i = 0; i < count.length; i++) {count[i] = 0;}
        count[max] = 0;

        for (let i = 0; i < arr.length; i++) {
          count[arr[i]]++;
        }

        for (let i = 1; i <= max; i++) {
          count[i] += count[i - 1];
        }

        for (let i = 0; i < arr.length; i++) {
          newArr[count[arr[i]] - 1] = arr[i];
          count[arr[i]]--;
        }

        return newArr.slice(0, newArr.length - 2);
      }
    },
    {
      name: 'selection',
      algorithm: (arr) => {
        const newArr: number[] = [];
        while (arr.length > 0) {
          let min: {val: number, index: number} = {val: Infinity, index: 0};

          for (let i = 0; i < arr.length; i++) {
            if (arr[i] < min.val) {
              min.val = arr[i];
              min.index = i;
            }
          }
          arr.splice(min.index, 1);
          newArr.push(min.val);
        }
        return newArr;
      }
    },
    {
      name: 'javascript',
      algorithm: (arr) => { // javascript array.sort()
        const sortedArr = arr.sort((a, b) => a - b);
        return sortedArr;
      }
    },
    {
      name: 'bubble',
      algorithm: (arr) => {
        while (!this.sorted(arr)) {
          console.log(arr);
          for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
              const temp = arr[i];
              arr[i] = arr[i + 1];
              arr[i + 1] = temp;
            }
          }
        }
        return arr;
      }
    }
  ];

  // private sortAlgorithms: {(arr: number[]): number[]}[] = [
  //   (arr) s=> {  // bogosort
  //     const sorted = (array: number[]) => {
  //       let isArraySorted = true;
  //       let prevValue = -Infinity;
  //       for (let i = 0; i < array.length; i++) {
  //         if (array[i] < prevValue) {
  //           isArraySorted = false;
  //           break;
  //         }
  //         prevValue = array[i];
  //       }
  //       return isArraySorted;
  //     }
  //     let shuffledArr: number[] = arr;
  //     while (!this.sortInterrupt && !sorted(shuffledArr)) {
  //       let tempArr: number[] = [];
  //       while (shuffledArr.length > 0) {
  //         const randIndex = Math.floor(Math.random()*shuffledArr.length);
  //         tempArr.push(shuffledArr[randIndex]);
  //         shuffledArr.splice(randIndex, 1);
  //       }
  //       shuffledArr = tempArr;
  //     }
  //     return shuffledArr;
  //   },
  //   (arr) => { // counting sort
  //     const max: number = arr.reduce((prev, curr) => prev > curr ? prev : curr);
  //     let count: number[] = new Array(max + 1);
  //     const newArr: number[] = new Array(arr.length);

  //     for (let i = 0; i < count.length; i++) {count[i] = 0;}
  //     count[max] = 0;

  //     for (let i = 0; i < arr.length; i++) {
  //       count[arr[i]]++;
  //     }

  //     for (let i = 1; i <= max; i++) {
  //       count[i] += count[i - 1];
  //     }

  //     for (let i = 0; i < arr.length; i++) {
  //       newArr[count[arr[i]] - 1] = arr[i];
  //       count[arr[i]]--;
  //     }

  //     return newArr.slice(0, newArr.length - 2);
  //   },
  //   (arr) => {
  //     const newArr: number[] = [];
  //     while (arr.length > 0) {
  //       let min: {val: number, index: number} = {val: Infinity, index: 0};

  //       for (let i = 0; i < arr.length; i++) {
  //         if (arr[i] < min.val) {
  //           min.val = arr[i];
  //           min.index = i;
  //         }
  //       }
  //       arr.splice(min.index, 1);
  //       newArr.push(min.val);
  //     }
  //     return newArr;
  //   },
  //   (arr) => { // javascript array.sort()
  //     const sortedArr = arr.sort((a, b) => a - b);
  //     return sortedArr;
  //   }
  // ]

  private arrays: {unsorted: number[], sorted: number[]} = {
    unsorted: [],
    sorted: []
  };

  set method(value: string) {
    this.createArray();

    if (value === 'bogo') {
      this.arrays.unsorted = this.arrays.unsorted.slice(0, 8);
    }

    this.methodEmitter.emit(value);
    this.sortIndex = this.methods.indexOf(value);
  }

  get methods(): string[] {
    return this.sortingAlgorithms.map(algorithm => algorithm.name);
  }

  createArray() {
    this.arrays.unsorted = new Array(100);

    for (let i = 0; i < 100; i++) {
      this.arrays.unsorted[i] = Math.floor(Math.random()*1000);
    }

    this.arrayEmitter.emit(this.arrays);
  }

  startSort() {
    this.arrays.sorted = this.sortingAlgorithms[this.sortIndex].algorithm(this.arrays.unsorted.slice());

    this.arrayEmitter.emit(this.arrays);

  }

  sorted(array: number[]) {
    let isArraySorted = true;
    let prevValue = -Infinity;
    for (let i = 0; i < array.length; i++) {
      if (array[i] < prevValue) {
        isArraySorted = false;
        break;
      }
      prevValue = array[i];
    }
    return isArraySorted;
  }
  constructor() { }
}
