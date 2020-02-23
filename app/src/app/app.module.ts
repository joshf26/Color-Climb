import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NativeScriptModule} from 'nativescript-angular/nativescript.module';
import {NativeScriptCommonModule} from 'nativescript-angular/common';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {ResultsComponent} from "~/app/results/results.component";

@NgModule({
    bootstrap: [
        AppComponent,
    ],
    imports: [
        NativeScriptModule,
        NativeScriptCommonModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        ResultsComponent,
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA,
    ]
})
export class AppModule { }
