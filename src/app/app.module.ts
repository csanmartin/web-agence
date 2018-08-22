import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CurrencyPipe, DatePipe, registerLocaleData} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './modules/material/material.module';
import localePt from '@angular/common/locales/pt';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';

import {AppRoutingModule} from './app-routing.module';
import {ApiService} from './services/api.service';
import {AppComponent} from './app.component';
import { CommercialComponent } from './components/commercial/commercial.component';
import { LineBarChartComponent } from './components/commercial/dialogs/line-bar-chart/line-bar-chart.component';
import { PieChartComponent } from './components/commercial/dialogs/pie-chart/pie-chart.component';

registerLocaleData(localePt, 'pt-BR');

export const CUSTOM_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MMMM YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@NgModule({
    declarations: [
        AppComponent,
        CommercialComponent,
        LineBarChartComponent,
        PieChartComponent
    ],
    entryComponents: [
        LineBarChartComponent,
        PieChartComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MaterialModule,
        AppRoutingModule,
        FlexLayoutModule
    ],
    providers: [
        ApiService,
        DatePipe,
        CurrencyPipe,
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMATS}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
