// angular
import {Injectable} from '@angular/core';
import {WindowService} from '../../core/index'
//avalon
import {IMicrophoneService} from '../index'

@Injectable()
export class WebMicrophoneService implements IMicrophoneService {
  constructor(public window: WindowService) {
    this.navigator = window.navigator;
  }

  navigator : Navigator;

  getMicrophoneAudioStream(): Promise<MediaStream> {

    this.navigator.getUserMedia = (this.navigator.getUserMedia ||
      this.navigator.webkitGetUserMedia ||
      this.navigator.mozGetUserMedia ||
      this.navigator.msGetUserMedia);

    if (!this.navigator.getUserMedia) {
      throw Error("cannot get microphone");
    }

    const audioConstraint: MediaStreamConstraints = { video: false, audio: true };
    return new Promise((resolve: (str: MediaStream) => void, reject: (str: MediaStreamError) => void) => {
      this.navigator.getUserMedia(audioConstraint,
        (stream) => resolve(stream),
        (err) => reject(err)
      );
    });

  }
}