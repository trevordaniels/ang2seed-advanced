/// <reference path="./mediaRecorder.d.ts" />

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

  run(): Promise<string> {
    var audioContext: AudioContext = new AudioContext();
    // var microphoneService = new WebMicrophoneService(this.window.navigator);
    var url = "";

    return new Promise((resolve: (str: string) => void, reject: (str: any) => void) => {

      this.microphoneService.getMicrophoneAudioStream()
        .then((stream) => {
          console.log("got stream");

            var recordedChunks : any[] = [];

          // Create an AudioNode from the stream.
          var audioSource = audioContext.createMediaStreamSource(stream);
          var recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

          recorder.ondataavailable = (event: any) => {
              if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }};

          recorder.start(1000);
          setTimeout(
            () => {             
              console.log('end recording');
              recorder.stop();
              audioContext.close();
               var blob = new Blob(recordedChunks);
                url = (window.URL || window.webkitURL).createObjectURL(blob);
                // var link = document.getElementById("save");
                resolve(url);
                // link.download = 'output.wav';  
            },
            3000);
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
          reject(err);
        });
    });
  }
}
