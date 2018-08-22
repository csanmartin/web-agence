import { Component, OnInit } from '@angular/core';
import {PieChartComponent} from './dialogs/pie-chart/pie-chart.component';
import {LineBarChartComponent} from './dialogs/line-bar-chart/line-bar-chart.component';
import {Moment} from 'moment';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {Consultant} from '../../models/consultant';
import {MatDatepicker, MatDialog} from '@angular/material';

@Component({
  selector: 'app-commercial',
  templateUrl: './commercial.component.html',
  styleUrls: ['./commercial.component.scss']
})
export class CommercialComponent implements OnInit {

    consultants: Consultant[] = [];
    consultantsFiltered: Consultant[] = [];
    initialDate = new Date(2007, 0);
    finalDate = new Date(2007, 11);
    minDate = new Date(2000, 0);
    maxDate = new Date(2020, 11);

    // Resultados de peticiones
    consultantsResult: Consultant[] = [];
    report = false;
    initialDateReport;
    finalDateReport;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private apiService: ApiService) {
    }

    ngOnInit() {
        // Se obtiene desde la api el listado de usuarios permitidos
        this.apiService.getConsultants().subscribe(response => {
            if (response.success) {
                this.consultants = response.data;
                this.consultants.sort((one, two) => (one.userName < two.userName ? -1 : 1));
            }
        }, error => {
            if (error) {
                this.router.navigate(['..'], {relativeTo: this.route}).then();
            }
        });
    }

    // Función para cerrar los calendarios antes de que estos pasen a la vista de días
    breakDatePicker(event: Moment, datepicker: MatDatepicker<Moment>, date) {
        if (date === 'initial') {
            this.initialDate = new Date(event.year(), event.month());
        } else {
            this.finalDate = new Date(event.year(), event.month());
        }
        console.log(this.initialDate, this.initialDateReport);
        if (this.initialDateReport.toString() !== this.initialDate.toString() ||
            this.finalDateReport.toString() !== this.finalDate.toString()) {
            this.report = false;
        }
        datepicker.close();
    }

    // Función para generar fechas en base a los numeros de mes y año
    getDate(year: number, month: number) {
        return new Date(year, month - 1);
    }

    // Función para actualizar al consultor como seleccionado
    selectConsultant(event, consultants: string) {
        if (consultants === 'allConsultants') {
            const index = this.consultants.findIndex(consultant => consultant.userName === event.option.value.userName);
            this.consultants[index].selected = !event.option.value.selected;
        } else {
            const index = this.consultantsFiltered.findIndex(consultant => consultant.userName === event.option.value.userName);
            this.consultantsFiltered[index].selected = !event.option.value.selected;
        }
    }

    // Funcion para mover a los consultores seleccionados de listado
    moveConsultants(fromConsultants: string) {
        if (fromConsultants === 'allConsultants') {
            this.consultantsFiltered = this.consultantsFiltered.concat(this.consultants.filter(consultant => consultant.selected));
            this.consultantsFiltered.sort((one, two) => (one.userName < two.userName ? -1 : 1));
            const consultantsCleaned: Consultant[] = [];
            this.consultantsFiltered.forEach(consultant => {
                consultantsCleaned.push({
                    userCode: consultant.userCode,
                    userName: consultant.userName
                });
            });
            this.consultantsFiltered = consultantsCleaned;
            this.consultants = this.consultants.filter(consultant => !consultant.selected);
            this.report = false;
        } else {
            this.consultants = this.consultants.concat(this.consultantsFiltered.filter(consultant => consultant.selected));
            this.consultants.sort((one, two) => (one.userName < two.userName ? -1 : 1));
            const consultantsCleaned: Consultant[] = [];
            this.consultants.forEach(consultant => {
                consultantsCleaned.push({
                    userCode: consultant.userCode,
                    userName: consultant.userName
                });
            });
            this.consultants = consultantsCleaned;
            this.consultantsFiltered = this.consultantsFiltered.filter(consultant => !consultant.selected);
            this.report = false;
        }
    }

    // Función para validar si activar o desactivar los botones
    disabledButton(button?: string) {
        if (button === 'allConsultants') {
            return this.consultants.filter(consultant => consultant.selected).length <= 0;
        } else if (button === 'consultantsFiltered') {
            return this.consultantsFiltered.filter(consultant => consultant.selected).length <= 0;
        } else if (button === 'report') {
            if (this.consultantsFiltered.length > 0) {
                return this.report;
            } else {
                return true;
            }
        } else {
            return this.consultantsFiltered.length <= 0;
        }
    }

    // Función para obtener los datos comerciales para reporte de los consultores seleccionados
    getReport() {
        const arrayConsultants: string[] = [];
        const minDate = this.initialDate.getFullYear() + '-' + (this.initialDate.getMonth() + 1) + '-1';
        const maxDate = this.finalDate.getFullYear() + '-' + (this.finalDate.getUTCMonth() + 1) + '-31';
        this.consultantsFiltered.forEach(consultant => {
            arrayConsultants.push(consultant.userCode);
        });
        this.apiService.getDataForReport(arrayConsultants, minDate, maxDate).subscribe(response => {
            if (response.success) {
                this.consultantsResult = response.data;
                this.report = true;
                this.initialDateReport = this.initialDate;
                this.finalDateReport = this.finalDate;
            }
        });
    }

    // Funcion que permite acceder al grafico de barras en un componente flotante
    getLineBarChart() {
        const arrayConsultants: string[] = [];
        this.consultantsFiltered.forEach(consultant => {
            arrayConsultants.push(consultant.userCode);
        });
        const dialogRef = this.dialog.open(LineBarChartComponent, {
            maxWidth: '850px',
            width: '98%',
            autoFocus: false,
            data: {
                initialDate: this.initialDate,
                finalDate: this.finalDate,
                arrayConsultants: arrayConsultants
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    // Funcion que permite acceder al grafico de torta en un componente flotante
    getPieChart() {
        const arrayConsultants: string[] = [];
        this.consultantsFiltered.forEach(consultant => {
            arrayConsultants.push(consultant.userCode);
        });
        const dialogRef = this.dialog.open(PieChartComponent, {
            maxWidth: '850px',
            width: '98%',
            autoFocus: false,
            data: {
                initialDate: this.initialDate,
                finalDate: this.finalDate,
                arrayConsultants: arrayConsultants
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

}
