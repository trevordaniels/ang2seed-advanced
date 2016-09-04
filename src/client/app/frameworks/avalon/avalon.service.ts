import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {InputCommand} from './inputCommand.enum';
import {WebAudioService, WebMicrophoneService, SpeechTranslationService, ISpeechTranslationClient} from './index';

import 'rxjs/add/observable/interval';

// import 'rxjs/add/operator/flatMap';

@Injectable()
export class AvalonService {

   
    constructor(private speechInputService: WebAudioService, private microphoneService: WebMicrophoneService, private speechTranslationService: SpeechTranslationService) { } 
    
    speechSubscription: Subscription;

    translate() : Observable<string> {
        return this.microphoneService.getMicrophoneSource()
            .mergeMap((audioSource) => this.speechInputService.getSpeech(audioSource, Observable.interval(3000)))
            .mergeMap((speech) => this.speechTranslationService.translate(speech));
            // .do(x => this.phrases.push(x))
            // .subscribe();                
}

    // start() {
    //     this.microphoneSubscription = this.microphoneService.getMicrophoneSource().subscribe(src => {
    //         //listen for audio data from mic and buffer into an audiofile
    //         let audioFile$ = this.speechInputService.getSpeech(src, Observable.interval(3000), Observable.interval(20000));
    //         audioFile$.subscribe((x) => {
    //                 var command$ = this.speechTranslationService.translate(x);
    //                 command$.subscribe(console.log);
    //         });
    //     }, console.log, () => {

    //     });
    // }

    stop() {
        console.log("stopping");
        this.speechSubscription.unsubscribe();
    }

    respondToCommand(command: InputCommand) {
        console.log(command);
        switch (command) {
            case InputCommand.Play:
                //play track
                return;
            case InputCommand.Stop:
            default:
                //stop track
                return;
        }
    }
}
