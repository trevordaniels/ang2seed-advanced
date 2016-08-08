import {Injectable} from '@angular/core';
import {ISpeechTranslationClient} from '../interfaces/iSpeechTranslation.client';
import {AuthenticationService} from '../authentication.service';
import {HttpService} from '../../core/services/http.service';
import {Observable} from 'rxjs/Observable';
import {RiffFileFactory} from './RiffFileFactory';

@Injectable()
export class BingSpeechTranslationClient implements ISpeechTranslationClient  {
    static DEFAULT_SAMPLE_RATE: number = 16000;
    static API_ENDPOINT: string = "https://speech.platform.bing.com/recognize";

    queue: any[];
    responseFormat: string = "json";
    requestUri: string;
    sourceSampleRate: number;
    sampleRate: number;
    connected: boolean;
    // buffer: SmartArray; // Int8Array;
    // offset: number;

    constructor(private httpService: HttpService, private authService: AuthenticationService) {
        // public riffFileFactory: RiffFileFactory,
        this.requestUri = `?scenarios=smd&appid=D4D52672-91D7-4C74-8AD8-42B1D98141A5&device.os=Windows10&version=3.0&instanceid=562D69FF-E928-4B7E-87DA-9A750B96D9E3&requestid=2065F912-3699-408C-A80A-9D17F42B9692`;
    }

    initialise(destination: MediaStreamAudioDestinationNode) {
        this.sourceSampleRate = destination.context.sampleRate;
        this.sampleRate = BingSpeechTranslationClient.DEFAULT_SAMPLE_RATE;
        this.connected = true;
        this.queue = []; //?
        // this.buffer = this.riffFileFactory.createFile(BingSpeechTranslationClient.DEFAULT_SAMPLE_RATE);
    }

    finalise() {
        this.connected = false;
        // this.onaudioend();
        // this.send();
    }

        
    handleResponse(response: any): any {
        if (typeof (response) == "string") {
            return response.json();
        }
        return response;
    }

    getAuthToken(): Observable<string> {
        return this.authService.getToken();
    } 
    
    sendAudio(audio: number[]) : Observable<any> {
        var riff = new RiffFileFactory().createFile(audio);
        var token$ = this.authService.getToken();
        return token$.mergeMap(token => {
            const url = `${BingSpeechTranslationClient.API_ENDPOINT}${this.requestUri}&locale=en-us&format=json`;
            const contentType = 'audio/wav; codec="audio/pcm"; samplerate=16000';
            return this.httpService.upload(url, contentType,riff, token);
            //.subscribe(response => this.processResult, this.processError)
        });        
    }       
    

    processAudio(audio: AudioBuffer) {
        // let resampledAudio = this.buffer.resample(audio.getChannelData(0), this.sourceSampleRate, this.sampleRate);
        // this.buffer.appendArray(resampledAudio);
    }

    processError(error: any) {
        console.log(error);
    }


      processResult(result: any) {
        var reco: string;
        if (result.results && result.results.length > 0 && result.results[0].name) {
            reco = result.results[0].name;
        }
        var phrases: any[] = [];
        for (var i = 0; i < result.results.length; ++i) {
            var r = result.results[i];
            phrases.push({
                lexical: r.lexical,
                display: r.name,
                inverseNormalization: null,
                maskedInverseNormalization: null,
                transcript: r.name,
                confidence: parseFloat(r.confidence)
            });
        }
        phrases.push(true); //phrases["final"] = true;
        var finalResult = {
            resultIndex: 0,
            results: {
                length: 1,
                0: phrases
            },
            interpretation: reco,
            emma: "", //null,
            status: 200
        };
        console.log(finalResult);
        //this.onresult(finalResult);
    }
}