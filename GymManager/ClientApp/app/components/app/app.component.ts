import { Component, ViewEncapsulation, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import 'moment/min/locales';
import { NgxCookieBannerComponent } from 'ngx-cookie-banner';
moment.locale('it-IT')

@Component({
    selector: 'app',
    template: require('./app.component.html'),
    styles: [require('../../styles/app.scss'), require('./app.component.scss')],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit, OnDestroy {

    @ViewChild('cookie', { static: false }) banner: NgxCookieBannerComponent;

    private _cookieSub: Subscription;

    constructor(private translate: TranslateService) {
        // https://github.com/ngx-translate/core
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang('en');
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.translate.use('it');
    }

    // It is currently necessary to manually subscribe at this
    // point to initialize the banner component.
    ngAfterViewInit(): void {
        this._cookieSub = this.banner.isSeen.subscribe();
    }

    ngOnDestroy(): void {
        this._cookieSub.unsubscribe();
    }
}
