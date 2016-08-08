
import {Observable} from 'rxjs/Observable';

import {InputCommand} from '../inputCommand.enum'

export interface ISpeechTranslationService {
  translate(audio: number[]): Observable<string>;
}