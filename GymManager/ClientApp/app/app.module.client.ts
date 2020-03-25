import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'
import { HttpClientModule } from '@angular/common/http';
import { sharedConfig } from './app.module.shared';

@NgModule({
    bootstrap: sharedConfig.bootstrap,
    declarations: sharedConfig.declarations,
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        // ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
        CustomFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ...sharedConfig.imports
    ],
    providers: [
        { provide: 'ORIGIN_URL', useValue: location.origin },
        ...sharedConfig.providers
    ],
    entryComponents: [
        ...sharedConfig.entryComponents
    ]
})
export class AppModule {
    constructor() {
        if (!isDevMode()) {
            console.log = () => { }
            // console.error = () => { }
        }
    }
}
