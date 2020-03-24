import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs/Rx";

var $: JQueryStatic = require('jquery');

@Component({
    selector: 'nav-menu',
    template: require('./navmenu.component.html'),
    styles: [require('./navmenu.component.scss')]
})
export class NavMenuComponent implements OnInit, AfterViewInit {
    public isCollapsed: boolean = true;

    homePage: string = 'mailing';

    constructor(private router: Router) {
    }

    public ngOnInit(): void {
       
    }

    public ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
        $('.backdrop').on('click', (event) => {
            var clickover = $(event.target);
            if (!clickover.hasClass('navbar-toggler')) {
                this.closeMenu();
            }
        });

        $('.collapse').on('show.bs.collapse', (e) => {
            $('.backdrop').fadeIn('fast');
        });

        $('.collapse').on('hide.bs.collapse', (e) => {
            $('.backdrop').fadeOut('fast');
        });

        $('.navbar-collapse').on('click', 'li:not(".btn-group"), a.dropdown-item', () => {
            $('.navbar-collapse').collapse('hide');
        });
    }

    //toggleMenu(event: Event): void {
    //    $(event.currentTarget).toggleClass("open");
    //}

    closeMenu(): void {
        // collapse menu dropdown
        if (this.isMenuOpened()) {
            $('.navbar-collapse').collapse('hide');
            // this.isCollapsed = true;
        }
    }

    isMenuOpened(): boolean {
        return $('.navbar-collapse').hasClass('show');
    }
}
