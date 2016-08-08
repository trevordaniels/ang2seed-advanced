// angular
import {ChangeDetectionStrategy} from '@angular/core';
// import {Http} from '@angular/http';
// app
import {NameListService} from '../../frameworks/app/index';
import {AnalyticsService} from '../../frameworks/analytics/index';
import {RouteComponent, PlatformDirective} from '../../frameworks/core/index';
import {LangSwitcherComponent} from '../../frameworks/i18n/index';
import {NavbarComponent} from './navbar.component';
import {ToolbarComponent} from './toolbar.component';

//avalon
import {WebAudioService, WebMicrophoneService, AvalonApp, RiffFileFactory, AuthenticationService, ISpeechTranslationService, SpeechTranslationService, BingSpeechTranslationClient, ISpeechTranslationClient} from '../../frameworks/avalon/index';

@RouteComponent({
  moduleId: module.id,
  selector: 'sd-app',
  viewProviders: [NameListService, WebMicrophoneService, WebAudioService, RiffFileFactory, AuthenticationService, BingSpeechTranslationClient, SpeechTranslationService, AvalonApp],
  providers: [NameListService, WebMicrophoneService, WebAudioService, RiffFileFactory, AuthenticationService, BingSpeechTranslationClient, SpeechTranslationService, AvalonApp],
  templateUrl: 'app.component.html',
  directives: [LangSwitcherComponent, NavbarComponent, ToolbarComponent, PlatformDirective],
  changeDetection: ChangeDetectionStrategy.Default // Everything else uses OnPush
})
export class AppComponent {
  constructor(public analytics: AnalyticsService) {

  }
}
