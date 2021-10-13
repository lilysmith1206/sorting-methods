import { Component, OnInit, Renderer2 } from '@angular/core';
import { SorterService } from '../sorter.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  options: string[];

  selectSorter(method: string) {
    this.sorterService.method = method;
  }

  capitaliseWord(word: string) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }

  constructor(private renderer: Renderer2, private sorterService: SorterService) {
  }

  ngOnInit(): void {
    this.options = this.sorterService.methods;
  }

}
