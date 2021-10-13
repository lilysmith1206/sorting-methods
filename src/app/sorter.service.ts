import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SorterService {

  private sortIndex: number = -1;
  public sortInterrupt: boolean = false;

  public methodEmitter = new EventEmitter<string>();
  public arrayEmitter = new EventEmitter<{unsorted: number[], sorted: number[]}>();
  public maxArrayLength: number = 200;

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
          console.log(newArr);
          count[arr[i]]--;
        }

        return newArr;
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

  private arrays: {unsorted: number[], sorted: number[]} = {
    unsorted: [],
    sorted: []
  };

  set method(value: string) {
    this.createArray();

    if (value === 'bogo') {
      this.arrays.unsorted = this.arrays.unsorted.slice(0, 10);
    }

    this.methodEmitter.emit(value);
    this.sortIndex = this.methods.indexOf(value);
  }

  get methods(): string[] {
    return this.sortingAlgorithms.map(algorithm => algorithm.name);
  }

  createArray() {
    this.arrays.unsorted = new Array(100);

    for (let i = 0; i < this.maxArrayLength; i++) {
      this.arrays.unsorted[i] = i; //Math.floor(Math.random()*1000);
    }

    this.arrays.unsorted = this.shuffleArray(this.arrays.unsorted.slice());

    this.arrayEmitter.emit(this.arrays);
  }

  shuffleArray(arr: number[]) {
    let tempArr: number[] = [];
    while (arr.length > 0) {
      const randIndex = Math.floor(Math.random()*arr.length);
      tempArr.push(arr[randIndex]);
      arr.splice(randIndex, 1);
    }

    return tempArr;
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
