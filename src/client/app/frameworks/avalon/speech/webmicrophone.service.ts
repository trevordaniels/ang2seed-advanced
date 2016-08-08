// angular
import {Injectable} from '@angular/core';
import {WindowService} from '../../core/index'
//avalon
import {IMicrophoneService} from '../index'

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class WebMicrophoneService implements IMicrophoneService {
  
  constructor(window: WindowService) {
    this.navigator = window.navigator;
  }

  navigator : Navigator;

  getMicrophoneStream(): Observable<MediaStream> {
    this.navigator.getUserMedia = (this.navigator.getUserMedia ||
      this.navigator.webkitGetUserMedia ||
      this.navigator.mozGetUserMedia ||
      this.navigator.msGetUserMedia);

    if (!this.navigator.getUserMedia) {
      throw Error("cannot get microphone");
    }

    const audioConstraint: MediaStreamConstraints = { video: false, audio: true };
    
    var source = Observable.create( (observer: Subscriber<MediaStream>) => {
      console.log('setting up get mic promise');
      this.navigator.getUserMedia(audioConstraint,
        (stream) => {
          console.log("got stream from mic.ts");
          // console.log(stream);
          observer.next(stream);
          // observer.complete();
        },
        (err) => observer.error(err)
      );

    });

    return source;
    
    // let pms = new Promise((resolve: (str: MediaStream) => void, reject: (str: MediaStreamError) => void) => {
    //   console.log('setting up get mic promise');
    //   this.navigator.getUserMedia(audioConstraint,
    //     (stream) => resolve(stream),
    //     (err) => reject(err)
    //   );
    // });

    // return Observable.fromPromise(pms);

  }
}