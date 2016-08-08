/// <reference path="./mediaRecorder.d.ts" />

// angular
import {Injectable} from '@angular/core';
import {WindowService} from '../../core/index';
import {SmartArray} from './SmartArray';
//avalon
import {WebMicrophoneService} from '../index';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


///Gets web audio as a media stream from microphone, boosts the bass, and plays it back through speakers
@Injectable()
export class WebAudioService {

  buffer: SmartArray; // Int8Array;
  // offset: number;
          
  constructor(private window: WindowService, private microphoneService: WebMicrophoneService) {
  }
  
  getMicrophoneSource(): Observable<MediaStreamAudioSourceNode> {
    var audioContext = new AudioContext();
    var v = this.microphoneService.getMicrophoneStream();
    // v.subscribe((d) => {
    //   console.log('got stream');
    //   console.log(d);
    // });

    var w = v.map((x) => {
      return audioContext.createMediaStreamSource(x);
    });
    return w;
    // console.log("got stream");
    // // Create an AudioNode from the stream.
    // var audioContext: AudioContext = new AudioContext();
    // var source = audioContext.createMediaStreamSource(stream);
    // return source;
  }
  
  /**
   * Listens to audio process event from audio source.
   * Receives float32 array of raw audio data
   * Resamples to configured sample rate and Int8Array
   * Buffers until stop message received then pushes full audio data array
   */
  getAudioEvents(audioSource: MediaStreamAudioSourceNode, stop$: Observable<any>): Observable<number[]> {
    //let audio processing event firing from source create an observable supplying audio Float32Arrays every ~millisecond
    //resample the raw audio data to desired sample rate as int array
    //build up an array of data arrays until stop message received eg. stop click, length of silence
    //then merge the arrays together into one array which is the entire raw audio file payload goodness
    var v = this.listenToAudioEvents(audioSource);
    // v.do(x => console.log('evt'));
    // v.subscribe(x => console.log('evt sub'));
    var w = v.map((x) => { return this.resample(x); });
    var x = w.buffer(stop$);
    var y = x.map(this.concatArray);
    return y;
  }

  concatArray(arr: number[][]): number[] {
    var v: number[] = [].concat.apply([], arr);
    // console.log("concat " + v.length);
    return v;
  }
  
  resample(input: AudioProcessingEvent): number[] {
    var samples = input.inputBuffer.getChannelData(0);

        let increments = 44100 / 16000;
        let newSamples : number[] = [];
        //adjust sampling rate
        for (var i = 0; i < samples.length; i += increments) {
            newSamples.push(Math.floor((samples[Math.floor(i)] - .5) * 128));
        }
        // console.log(newSamples);
        return  newSamples;
     }
  

  listenToAudioEvents(source: MediaStreamAudioSourceNode): Observable<AudioProcessingEvent> {
    //listen to audio event
    var destination = source.context.createScriptProcessor(4096, 1, 1);
    destination.connect(source.context.destination);
    source.connect(destination);

    return Observable.create((observer: Subscriber<AudioProcessingEvent>) => {
      destination.onaudioprocess = (x) => {
        // console.log("evt in obs");
        observer.next(x);
      }
    });
    // return Observable.fromEvent<AudioProcessingEvent>(destination, 'onaudioprocess');
  }
}

  // receiveAudio(audioEvent: AudioProcessingEvent) : Observable<SmartArray> {

  //   var silence = false;
  //   if (!silence) {
  //     if (!this.buffer) {
  //       //  start new file
  //       this.buffer = this.riffFileFactory.createFile();
  //     }
  //     // push to file
  //     var audio = this.buffer.resample(audioEvent.inputBuffer.getChannelData(0), 44100, 16000);
  //     this.buffer.appendArray(audio);
  //   } else { //else silence, close and send file
  //     if (this.buffer) {
  //       return Observable.of(this.buffer);
  //     }

  //   }
  //   // httpClient.appendAsUInt8(evt.inputBuffer.getChannelData(0));
  // }

  // saveAudioToFile(source: MediaStreamAudioSourceNode) {
  //   var recordedChunks: any[] = [];

  //         // Create an AudioNode from the stream.
  //         var audioSource = source.context.createMediaStreamSource(stream);
  //         var recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

  //         recorder.ondataavailable = (event: any) => {
  //           if (event.data.size > 0) {
  //             recordedChunks.push(event.data);
  //           }
  //         };

  //         recorder.start();
  //         setTimeout(
  //           () => {
  //             console.log('end recording');
  //             recorder.stop();
  //             audioContext.close();
  //             var blob = new Blob(recordedChunks);
  //             var url = window.URL.createObjectURL(blob);
  //             stream.getAudioTracks()[0].stop();
  //             resolve(url);
  //           },
  //           3000);
  // }


