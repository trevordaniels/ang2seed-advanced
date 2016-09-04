
import {Observable} from 'rxjs/Observable';

export interface IMicrophoneService {
  getMicrophoneSource(): Observable<MediaStreamAudioSourceNode>;
}