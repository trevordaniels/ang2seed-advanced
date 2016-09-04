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
// import 'rxjs/add/observable/publish';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/publish';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounce';

import 'rxjs/add/operator/delay';


@Injectable()
export class WebAudioService {

  /**
   * Silence has a value of approx -64
   * Noise allows for slight variation before considered as valid speech
   */
  static BASE_SILENCE: number = -64;
  static NOISE_ALLOWANCE: number = 4;
  static WAIT_TIME_AFTER_SPEECH: number = 100;

  upperNoiseRange: number = WebAudioService.BASE_SILENCE + WebAudioService.NOISE_ALLOWANCE;
  lowerNoiseRange: number = WebAudioService.BASE_SILENCE - WebAudioService.NOISE_ALLOWANCE;


  constructor() {
  }

  /**
   * Receives audio from source and returns spoken words and/or phrases. 
   * Listens to audio process event from audio source.
   * Receives float32 array of raw audio data
   * Resamples to configured sample rate and Int8Array
   * Buffers until break message received then pushes full audio data array
   */
  getSpeech(audioSource: MediaStreamAudioSourceNode, break$: Observable<any>): Observable<number[]> {
    //let audio processing event firing from source create an observable supplying audio Float32Arrays every ~millisecond
    //resample the raw audio data to desired sample rate as int array
    //build up an array of data arrays until stop message received eg. stop click, length of silence
    //then merge the arrays together into one array which is the entire raw audio file payload goodness
    console.log("get Speech");
    let destination = this.createDestination(audioSource);
    var resampledAudioStream = this.listenToAudioEvents(destination).publish(); //.do(console.log);    

    //debounceTime emits a val after period of inactivity  
    var speechEndedStream = resampledAudioStream.debounceTime(300);//.do(console.log);    

    var bufferedAudioStream = resampledAudioStream.buffer(speechEndedStream);//.do(console.log);

    resampledAudioStream.connect();

    // bufferedAudioStream.subscribe(console.log, console.log, console.log);
    // // var f = resampledAudioStream.bufferWhen(() => Observable.of(resampledAudioStream));
    var concatenatedAudioStream = bufferedAudioStream.map(this.concatArray);
    let speechFilteredAudioStream = concatenatedAudioStream.filter((audio) => audio.length > 5000);
    return speechFilteredAudioStream;
  }


  concatArray(arr: number[][]): number[] {
    var v: number[] = [].concat.apply([], arr);
    console.log("concat " + v.length);
    return v;
  }

  resample(rawAudio: Float32Array): number[] {

    let increments = 44100 / 16000;
    let newSamples: number[] = [];
    //adjust sampling rate
    for (var i = 0; i < rawAudio.length; i += increments) {
      let newSample = Math.floor((rawAudio[Math.floor(i)] - .5) * 128);
      newSamples.push(newSample);
    }

    //check there is some sound not noise in this sample
    if (newSamples.some((val) => !this.isNoise(val))) {
      return newSamples;
    }
    return [];
  }

  isNoise(audioValue: number): boolean {
    // if (audioValue < 1 && audioValue > -1) {
    return (-0.1 < audioValue && audioValue < 0.1) ||
      (this.lowerNoiseRange < audioValue && audioValue < this.upperNoiseRange);
  }

  createDestination(source: MediaStreamAudioSourceNode): ScriptProcessorNode {
    let audioContext = source.context;
    
    var processingDestination = audioContext.createScriptProcessor(4096, 1, 1);
 

    // var delayNode = source.context.createDelay(2000);
    // convolver.connect(gainNode);
    // gainNode.connect(audioCtx.destination);
    
    processingDestination.connect(source.context.destination);
    source.connect(processingDestination);
    return processingDestination;
  }

  listenToAudioEvents(destination: ScriptProcessorNode): Observable<number[]> {
    //listen to audio event
    return Observable.create((observer: Subscriber<number[]>) => {
      destination.onaudioprocess = (audioEvent) => {
        var samples = audioEvent.inputBuffer.getChannelData(0);
        var resampledAndFilteredAudio = this.resample(samples);
        if (resampledAndFilteredAudio.length > 0) {
          observer.next(resampledAndFilteredAudio);
        }
      }
    });
    // return Observable.fromEvent<AudioProcessingEvent>(destination, 'onaudioprocess');
  }

  // listenToSilence(destination: ScriptProcessorNode): Observable<boolean> {
  //   //listen to audio event
  //   return Observable.create((observer: Subscriber<boolean>) => {
  //     destination.onaudioprocess = (audioEvent) => {
  //       var samples = audioEvent.inputBuffer.getChannelData(0);
  //       if (samples.every((elem) => this.isNoise(elem))) {
  //         observer.next(true);
  //       }
  //     }
  //   });
  // }



}



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


