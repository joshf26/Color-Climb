import {NgModule} from '@angular/core';
import {NativeScriptRouterModule} from 'nativescript-angular/router';
import {Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {LoadingComponent} from "~/app/loading/loading.component";
import {ResultsComponent} from "~/app/results/results.component";

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'loading', component: LoadingComponent},
    {path: 'results', component: ResultsComponent},
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
