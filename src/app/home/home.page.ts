import { Component } from '@angular/core';

export interface Book {
  title: string;
  path: string;
  competitionOpen: boolean
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items: Book[] = [
    {
      title: 'Os Miseráveis',
      path: './assets/imgs/les-miserables.jpg',
      competitionOpen: false
    },
    {
      title: 'Don Quixote',
      path: './assets/imgs/don-quixote.jpg',
      competitionOpen: true
    },
    {
      title: 'Peter Pan',
      path: './assets/imgs/peter-pan.jpg',
      competitionOpen: true
    },
    {
      title: 'Tarzan',
      path: './assets/imgs/tarzan.jpg',
      competitionOpen: false
    },
    {
      title: 'Morro dos Ventos Uivantes',
      path: './assets/imgs/wuthering-heights.jpg',
      competitionOpen: true
    },
    {
      title: 'Frankenstein',
      path: './assets/imgs/frankenstein.jpg',
      competitionOpen: true
    },
    {
      title: 'Dom Casmurro',
      path: './assets/imgs/dom-casmurro.jpg',
      competitionOpen: true
    }
  ];

  constructor() {

  }

}
