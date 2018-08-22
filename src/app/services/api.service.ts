import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    // BASE URL API Restful
    BASE_URL = 'http://localhost:3000/';

    constructor(private _http: HttpClient) {
    }

    // Petición GET para obtener el listado de consultores
    getConsultants(): Observable<any> {
        return this._http.get(this.BASE_URL + 'consultants/');
    }

    // Peticiones POST para obtener información comercial de los consultores
    // Para el reporte
    getDataForReport(arrayConsultants, minDate, maxDate): Observable<any> {
        const consultants = {
            consultants: arrayConsultants
        };
        return this._http.post(this.BASE_URL + 'consultants/getDataForReport/' + minDate + '/' + maxDate, consultants);
    }

    // Para el grafico de barras
    getDataForBarChart(arrayConsultants, minDate, maxDate): Observable<any> {
        const consultants = {
            consultants: arrayConsultants
        };
        return this._http.post(this.BASE_URL + 'consultants/getDataForBarChart/' + minDate + '/' + maxDate, consultants);
    }

    // Para el grafico de torta
    getDataForPieChart(arrayConsultants, minDate, maxDate): Observable<any> {
        const consultants = {
            consultants: arrayConsultants
        };
        return this._http.post(this.BASE_URL + 'consultants/getDataForPieChart/' + minDate + '/' + maxDate, consultants);
    }
}
