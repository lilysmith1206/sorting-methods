import { Component } from '@angular/core';
import { SorterService } from './sorter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  method: string;
  sortTime: number = 0;
  hasSorted: boolean = false;
  arrays: {unsorted: number[][], sorted: number[][]} = {
    unsorted: [],
    sorted: []
  };

  constructor(private sorterService: SorterService) {
    sorterService.methodEmitter.subscribe(val => {
      this.method = val;
      this.hasSorted = false;
    })

    sorterService.arrayEmitter.subscribe(obj => {
      if (sorterService.method === 'bogo') {
        this.arrays.unsorted[0] = obj.unsorted.slice(0, 20);
        this.arrays.sorted[0] = obj.sorted.slice(0, 20);
      }
      const rowAmt: number = 10;
      const sortedColAmt: number = obj.unsorted.length/rowAmt;
      for (let i = 0; i < rowAmt; i++) {
        this.arrays.sorted[i] = obj.sorted.slice(i*sortedColAmt, i*sortedColAmt + sortedColAmt);
      }

      const unsortedColAmt: number = obj.unsorted.length/rowAmt;
      for (let i = 0; i < rowAmt; i++) {
        this.arrays.unsorted[i] = obj.unsorted.slice(i*unsortedColAmt, i*unsortedColAmt + unsortedColAmt);
      }

    })
  }

  startSort() {
    const startTime = Date.now();
    this.sorterService.startSort();
    setTimeout( () => {
      this.sortTime = Date.now() - startTime;
      this.hasSorted = true;
    })

  }

  restartSort() {
    this.sorterService.method = this.method;
    this.sortTime = 0;
    setTimeout( () => {
      this.startSort();
    });
  }

  createTextColour(value: number) {
    const c = 20 + Math.floor(235 * value / this.sorterService.maxArrayLength);

    return `rgb(${c}, ${c}, ${c})`;
  }
}
