import { Component, OnInit, ViewChild } from '@angular/core';
import {Howl, Howler} from 'howler';
import { IonRange } from '@ionic/angular';

export interface Track {
  name: string;
  path: string;
  liked: boolean;
}
@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {
  playlist: Track[] = [
    {
      name: 'Elias Lawrence',
      path: './assets/mp3/como-nossos-pais.mp3',
      liked: true
    },
    {
      name: 'Leonardo Fiorio',
      path: './assets/mp3/criminal.mp3',
      liked: false
    },
    {
      name: 'Maria Antonieta',
      path: './assets/mp3/every-time.mp3',
      liked: false
    },
    {
      name: 'Elias Lawrence',
      path: './assets/mp3/como-nossos-pais.mp3',
      liked: true
    },
    {
      name: 'Leonardo Fiorio',
      path: './assets/mp3/criminal.mp3',
      liked: false
    },
    {
      name: 'Elias Lawrence',
      path: './assets/mp3/como-nossos-pais.mp3',
      liked: true
    },
    {
      name: 'Leonardo Fiorio',
      path: './assets/mp3/criminal.mp3',
      liked: false
    }
  ];

  text: string = "Entre os pecados que os homens cometem, ainda que afirmam alguns que o maior de todos é a soberba, sustento eu que é a ingratidão, baseando-me no que se costuma dizer, que de mal agradecidos está o inferno cheio.";//"Nunca pense que seu amor é impossível, nunca diga \"eu não acredito no amor\".";

  activeTrack: Track = null;
  player: Howl       = null;
  isPlaying          = false;
  progress           = 0;
  @ViewChild('range', {static: false}) range: IonRange;

  constructor() {

  }

  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }

  start(track: Track) {
    if(this.player){
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.path],
      html5: true,
      onplay: () => {
        this.isPlaying = true;
        this.activeTrack = track;
        this.updateProgress();
      },
      onend: () => {

      }
    });
    
    this.player.play();
  }

  togglePlayer(pause) {
    this.isPlaying = !pause;

    if(pause){
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  next() {
    let index = this.playlist.indexOf(this.activeTrack);
    if(index != this.playlist.length - 1){
      this.start(this.playlist[index + 1]);      
    } else {
      this.start(this.playlist[0]);
    }
  }

  prev() {
    let index = this.playlist.indexOf(this.activeTrack);
    if(index > 0){
      this.start(this.playlist[index - 1]);      
    } else {
      this.start(this.playlist[this.playlist.length - 1]);
    }
  }

  seek() {
    let newValue = +this.range.value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue/100));
  }

  updateProgress() {
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress();
    }, 1000);
  }
}
