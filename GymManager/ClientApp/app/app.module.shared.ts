import { NgModule, LOCALE_ID, isDevMode } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { NgBusyModule } from 'ng-busy';
import { NgxCookieBannerModule } from 'ngx-cookie-banner';
import { FileUploadModule } from 'ng2-file-upload';
import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';
import { ClickOutsideModule } from 'ng-click-outside';
import { ColorSketchModule } from 'ngx-color/sketch';
import { AvatarModule } from 'ngx-avatar'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxSummernoteModule } from 'ngx-summernote';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { SchedulerModule } from 'angular-calendar-scheduler';

import { AppComponent } from './components/app/app.component';
import { AppRoutingModule, routedComponents } from './app-routing.module';

import { NavMenuComponent } from './components/navmenu/navmenu.component';

import { DecimalPipe, DatePipe } from '@angular/common';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt);

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const sharedConfig: NgModule = {
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        NgBusyModule,
        NgxCookieBannerModule.forRoot({
            cookieName: 'cookie-law-seen',
        }),
        FileUploadModule,
        MomentModule,
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
            progressBar: true
        }),
        ClickOutsideModule,
        NgbModule,
        NgxSelectModule,        // Esempio di utilizzo: https://github.com/optimistex/ngx-select-ex/issues/36#issuecomment-371116489
        NgxSummernoteModule,
        CKEditorModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        SchedulerModule.forRoot({
            locale: 'it',
            headerDateFormat: 'daysRange',
            logEnabled: false
        }),
        ColorSketchModule,
        AvatarModule
    ],
    declarations: [
        AppComponent,
        NavMenuComponent,
        routedComponents
    ],
    providers: [
        { provide: 'HOME_PAGE', useValue: 'mailing' },
        DatePipe,
        DecimalPipe,
        { provide: LOCALE_ID, useValue: 'it-IT' }
    ],
    entryComponents: [
    ],
    bootstrap: [AppComponent]
};
