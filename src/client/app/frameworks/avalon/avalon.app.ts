import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {InputCommand} from './inputCommand.enum';
import {WebAudioService, WebMicrophoneService, SpeechTranslationService, ISpeechTranslationClient} from './index';

import 'rxjs/add/observable/interval';

@Injectable()
export class AvalonApp {

    constructor(private audioSource: WebAudioService, private speechTranslationService: SpeechTranslationService) { } 
    //
        //,

    // audioSource: WebAudioService;
    
    main() {
        //initialise mic  
        let count = 1;
        var v = this.audioSource.getMicrophoneSource();
        v.subscribe(src => {
            
            //listen for audio data from mic and buffer into an audiofile
            let audioFile$ = this.audioSource.getAudioEvents(src, Observable.interval(3000));
            
            audioFile$.subscribe((x) => {
                // console.log(x);
                if (count++ <= 5) {
                    var command$ = this.speechTranslationService.translate(x);
                    command$.subscribe(console.log); 
                }

            });
        });
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
