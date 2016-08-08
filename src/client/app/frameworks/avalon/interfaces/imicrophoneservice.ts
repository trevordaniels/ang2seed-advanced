
import {Observable} from 'rxjs/Observable';

export interface IMicrophoneService {
  getMicrophoneStream(): Observable<MediaStream>;
}