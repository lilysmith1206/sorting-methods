import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SorterService {

  private sortIndex: number = -1;
  public sortInterrupt: boolean = false;

  public methodEmitter = new EventEmitter<string>();
  public arrayEmitter = new EventEmitter<{unsorted: number[], sorted: number[]}>();

  public methods: string[] = [
    'bogo',
    'counting',
    'selection',
    'javascript'
  ];

  private sortAlgorithms: {(arr: number[]): number[]}[] = [
    (arr) => {
      const sorted = (array: number[]) => {
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
      let shuffledArr: number[] = arr;
      while (!this.sortInterrupt && !sorted(shuffledArr)) {
        let tempArr: number[] = [];
        while (shuffledArr.length > 0) {
          const randIndex = Math.floor(Math.random()*shuffledArr.length);
          tempArr.push(shuffledArr[randIndex]);
          shuffledArr.splice(randIndex, 1);
        }
        shuffledArr = tempArr;
      }
      return shuffledArr;
    }, // bogosort
    (arr) => {return arr}, // counting sort
    (arr) => {return arr}, // selection sort
    (arr) => {
      const sortedArr = arr.sort((a, b) => a - b);
      return sortedArr;
    } // javascript array.sort()
  ]

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

  createArray() {
    this.arrays.unsorted = new Array(100);

    for (let i = 0; i < 100; i++) {
      this.arrays.unsorted[i] = Math.floor(Math.random()*1000);
    }

    this.arrayEmitter.emit(this.arrays);
  }

  startSort() {
    this.arrays.sorted = this.sortAlgorithms[this.sortIndex](this.arrays.unsorted);

    this.arrayEmitter.emit(this.arrays);

  }
  constructor() { }
}
