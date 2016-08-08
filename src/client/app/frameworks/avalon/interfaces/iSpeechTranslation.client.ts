
import {Observable} from 'rxjs/Observable';
import {InputCommand} from '../inputCommand.enum'

export interface ISpeechTranslationClient {
  
  sendAudio(audio: any[]): Observable<any>;

}