import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  arrays: {unsorted: number[], sorted: number[]} = {
    unsorted: [],
    sorted: []
  };

  constructor(private sorterService: SorterService) {
    sorterService.methodEmitter.subscribe(val => {
      this.method = val;
      this.hasSorted = false;
    })

    sorterService.arrayEmitter.subscribe(obj => {
      this.arrays = obj;
    })
  }

  startSort() {
    const startTime = new Date();
    this.sorterService.startSort();
    this.sortTime = new Date().getMilliseconds() - startTime.getMilliseconds();
    this.hasSorted = true;
  }

  restartSort() {
    this.sorterService.method = this.method;
    this.sortTime = 0;
    setTimeout( () => {
    this.startSort();
    });
  }
}
