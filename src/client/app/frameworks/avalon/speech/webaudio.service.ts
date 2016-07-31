// angular
import {Injectable} from '@angular/core';
import {WindowService} from '../../core/index'

//avalon
import {WebMicrophoneService} from '../index'

///Gets web audio as a media stream from microphone, boosts the bass, and plays it back through speakers
@Injectable()
export class WebAudioService {

  constructor(public window: WindowService, public microphoneService: WebMicrophoneService) {
  }

  run() {
    var audioContext: AudioContext = new AudioContext();
    // var microphoneService = new WebMicrophoneService(this.window.navigator);

    this.microphoneService.getMicrophoneAudioStream()
      .then((stream) => {
        console.log("got stream");

        // Create an AudioNode from the stream.
        var audioSource = audioContext.createMediaStreamSource(stream);

        // Create a biquadfilter
        var biquadFilter = audioContext.createBiquadFilter();
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;
        biquadFilter.gain.value = 5;

        // connect the AudioBufferSourceNode to the gainNode  and the gainNode to the destination ie. default browser speakers, tp play the audio
        audioSource.connect(biquadFilter);
        biquadFilter.connect(audioContext.destination);
      })
      .catch((err) => {
        console.log("error getting audio stream");
        console.log(err);
      });
  }
}
