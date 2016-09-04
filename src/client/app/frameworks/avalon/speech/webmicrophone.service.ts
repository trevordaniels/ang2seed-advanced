// angular
import {Injectable} from '@angular/core';
import {WindowService} from '../../core/index'
//avalon
import {IMicrophoneService} from '../index'

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subscriber} from 'rxjs/Subscriber';

@Injectable()
export class WebMicrophoneService implements IMicrophoneService {

  navigator: Navigator;

  constructor(window: WindowService) {
    this.navigator = window.navigator;
    this.navigator.getUserMedia = (this.navigator.getUserMedia ||
      this.navigator.webkitGetUserMedia ||
      this.navigator.mozGetUserMedia ||
      this.navigator.msGetUserMedia);

    if (!this.navigator.getUserMedia) {
      throw Error("cannot get microphone");
    }
  }

  getMicrophoneSource(): Observable<MediaStreamAudioSourceNode> {
    return Observable.create((observer: Subscriber<MediaStreamAudioSourceNode>) => {
      let audioContext = new AudioContext();
      this.navigator.getUserMedia({ video: false, audio: true },
        (stream) => {
          let source = audioContext.createMediaStreamSource(stream);
          observer.next(source);
          // observer.complete();
        },
        (err) => observer.error(err)
      );
      // dispose resources
      return () => {
        // console.log('disposing');
        audioContext.close();
      };
    });
  }

}