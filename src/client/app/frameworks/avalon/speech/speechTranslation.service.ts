import {Observable} from 'rxjs/Observable';
import {BingSpeechTranslationClient} from '../index';
import {ISpeechTranslationService} from '../interfaces/iSpeechTranslation.service';
import {InputCommand} from '../inputCommand.enum'
import {Injectable} from '@angular/core';

@Injectable()
export class SpeechTranslationService implements ISpeechTranslationService {

    constructor(private speechTranslationClient: BingSpeechTranslationClient) { }

    translate(audio: number[]): Observable<string> {
        console.log("get Speech");
        return this.speechTranslationClient.sendAudio(audio)
            .map((response: any) => {
                // console.log(response);
                let result = "No speech";
                if (response.results) {
                    result = response.results.map((x: any) => x.lexical).join(" ");
                }    
                return result;
                // switch (response.firstWord) {
                //     case "play": return InputCommand.Play;
                //     default: return InputCommand.Yes;
                // }
            });
    }
}
