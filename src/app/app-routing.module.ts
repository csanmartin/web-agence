import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommercialComponent} from './components/commercial/commercial.component';

const routes: Routes = [
    {
        path: 'commercial',
        pathMatch: 'full',
        component: CommercialComponent,
        data: {
            title: 'Comercial'
        }
    },
    {
        path: '**',
        redirectTo: 'commercial'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
