import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NativeScriptModule} from 'nativescript-angular/nativescript.module';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {LoadingComponent} from "~/app/loading/loading.component";
import {ResultsComponent} from "~/app/results/results.component";

@NgModule({
    bootstrap: [
        AppComponent,
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoadingComponent,
        ResultsComponent,
    ],
    providers: [
        ResultsComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
    ]
})
export class AppModule { }
