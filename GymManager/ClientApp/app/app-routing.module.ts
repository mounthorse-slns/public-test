import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContainerComponent } from './components/container/container.component';
import { MailingComponent } from './components/mailing/mailing.component';

// https://angular.io/guide/router
const routes: Routes = [
    {
        path: '',
        component: ContainerComponent,
        children: [
            //{
            //    path: '',
            //    redirectTo: '',
            //    pathMatch: 'full'
            //},
            {
                path: '',
                component: MailingComponent
            },
            {
                path: '**',
                component: MailingComponent
            }
        ]
    }
];

// https://angular.io/docs/ts/latest/guide/router.html#!#routing-module
// https://angular.io/api/router/ExtraOptions
@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: false, enableTracing: false, scrollPositionRestoration: 'enabled' })
        // preloadingStrategy: PreloadAllModules (https://angular.io/docs/ts/latest/guide/router.html#!#preloading)
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ]
})
export class AppRoutingModule { }

export const routedComponents = [
    ContainerComponent,
    MailingComponent
];