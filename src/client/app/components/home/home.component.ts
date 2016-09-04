// libs
import { Store } from '@ngrx/store';


//ang2
import {DomSanitizationService, SafeUrl} from '@angular/platform-browser'
import {ChangeDetectorRef} from '@angular/core';


// app
import { BaseComponent, RouterExtensions } from '../../frameworks/core/index';
import { NameListService } from '../../frameworks/sample/index';

import {AvalonService} from '../../frameworks/avalon/index';

@BaseComponent({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent {
  public newName: string = '';
  public audioFileUrl: SafeUrl = 'test';

 phrases: string = "Get ready";

 constructor(
   private store: Store<any>,
   public nameListService: NameListService,
   public routerext: RouterExtensions,
   // public webAudioService: WebAudioService,
   public avalonService: AvalonService,
   private sanitizer: DomSanitizationService,
   private cd: ChangeDetectorRef) {
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
    this.phrases = "Atarting audio";
    this.cd.markForCheck();
    console.log("running audio");
    this.avalonService.translate().subscribe(
      (x) => {
        this.phrases = x;
        this.cd.markForCheck();
      }
    );

    // .then((audioFileUrl) => {
    //   this.audioFileUrl = this.sanitizer.bypassSecurityTrustUrl(audioFileUrl);
    // });
  }

  readAbout() {
    // Try this in the {N} app
    // {N} can use these animation options
    this.routerext.navigate(['/about'], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }
}
