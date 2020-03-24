import { Component, ViewEncapsulation, NgZone, Renderer, ElementRef, ViewChild, Inject, HostListener, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import {
    Router,
    ActivatedRoute,
    NavigationExtras,
    // import as RouterEvent to avoid confusion with the DOM Event
    Event as RouterEvent,
    NavigationStart,
    RoutesRecognized,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router';
import { map } from 'rxjs/operators';
import { getYear } from 'date-fns';

var $: JQueryStatic = require('jquery');

@Component({
    selector: 'container',
    template: require("./container.component.html"),
    styles: [require('./container.component.scss')]
})
export class ContainerComponent implements AfterViewInit {
    noScrollTop: boolean;

    screenHeight: number;
    screenWidth: number;

    @HostListener('window:resize', ['$event'])
    getScreenSize() {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
    }

    // Instead of holding a boolean value for whether the spinner
    // should show or not, we store a reference to the spinner element,
    // see template snippet below this script
    @ViewChild('spinnerElement', { static: false }) spinnerElement: ElementRef;

    constructor(private router: Router, private route: ActivatedRoute, private ngZone: NgZone, private renderer: Renderer,
        private location: Location, @Inject('HOME_PAGE') private homePage: string)
    {
        this.router.events.subscribe((event: RouterEvent) => {
            this._navigationInterceptor(event);
        });    }

    public ngAfterViewInit(): void {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
    }


    // Shows and hides the loading spinner during RouterEvent changes
    private _navigationInterceptor(event: RouterEvent): void {
        if (event instanceof RoutesRecognized) {
            this.noScrollTop = (event as RoutesRecognized).state.root.queryParams['noScrollTop'];

            //let spinnerDisabled: boolean = (event as RoutesRecognized).state.root.queryParams['disableSpinner'];
            //if (!spinnerDisabled) {
            //    // We wanna run this function outside of Angular's zone to
            //    // bypass change detection
            //    this.ngZone.runOutsideAngular(() => {

            //        // For simplicity we are going to turn opacity on / off
            //        // you could add/remove a class for more advanced styling
            //        // and enter/leave animation of the spinner
            //        this.renderer.setElementStyle(
            //            this.spinnerElement.nativeElement,
            //            'display',
            //            'inline-flex'
            //        );
            //    });
            //}
        }
        if (event instanceof NavigationEnd) {
            //this.location.replaceState(event.url.split("?")[0]); // Remove ?disableSpinner=true if exists
            //this._hideSpinner();

            if (!this.noScrollTop) {
            }

            this.location.replaceState(event.url.split("?")[0]); // Remove ?disableSpinner=true&noScrollTop=true if exists
            this.noScrollTop = false;
        }

        // Set loading state to false in both of the below events to
        // hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
            //this._hideSpinner();
        }
        if (event instanceof NavigationError) {
            //this._hideSpinner();
        }
    }

    private _hideSpinner(): void {

        // We wanna run this function outside of Angular's zone to
        // bypass change detection, 
        this.ngZone.runOutsideAngular(() => {

            // For simplicity we are going to turn opacity on / off
            // you could add/remove a class for more advanced styling
            // and enter/leave animation of the spinner
            this.renderer.setElementStyle(
                this.spinnerElement.nativeElement,
                'display',
                'none'
            );
        });
    }
}
