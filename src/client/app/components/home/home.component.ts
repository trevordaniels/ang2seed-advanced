// libs
import {Store} from '@ngrx/store';

// app
import {FormComponent} from '../../frameworks/core/index';
import {NameListService} from '../../frameworks/app/index';
import {WebAudioService} from '../../frameworks/avalon/index';

@FormComponent({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent {
  public newName: string = '';
  public audioFileUrl: string = 'test';

  constructor(private store: Store<any>, public nameListService: NameListService, public webAudioService: WebAudioService) {   
  }
  
  /*
   * @param newname  any text as input.
   * @returns return false to prevent default form submit behavior to refresh the page.
   */
  addName(): boolean {
    this.nameListService.add(this.newName);
    this.newName = '';
    return false;
  }

//https://angular.io/docs/ts/latest/guide/security.html#!#xss blob is rendered as unsafe url!!
  runAudio() {
    console.log("running audio");
    this.webAudioService.run().then((url) => {
        this.audioFileUrl = url;
    });
  }
}
