import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {PieChartData} from '../../../../models/pieChartData';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as Chart from 'chart.js';
import {CurrencyPipe, DatePipe} from '@angular/common';

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

    @ViewChild('PieChart') pieChartCanvas;
    pieChart;
    initialDate;
    finalDate;
    arrayConsultants: string[] = [];
    pieChartData: PieChartData;

    constructor(public dialogRef: MatDialogRef<PieChartComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private apiService: ApiService,
                private currencyPipe: CurrencyPipe,
                private datePipe: DatePipe) {
        // Se acceden a los datos para generar la consulta desde el componente que ordeno cargar a este
        this.initialDate = this.data.initialDate;
        this.finalDate = this.data.finalDate;
        this.arrayConsultants = this.data.arrayConsultants;
    }

    ngOnInit() {
        const minDate = this.initialDate.getFullYear() + '-' + (this.initialDate.getMonth() + 1) + '-1';
        const maxDate = this.finalDate.getFullYear() + '-' + (this.finalDate.getUTCMonth() + 1) + '-31';
        // Se obtienen los datos desde la api
        this.apiService.getDataForPieChart(this.arrayConsultants, minDate, maxDate).subscribe(response => {
            if (response.success) {
                this.pieChartData = response.data;
                this.loadPieChart();
            } else {
                this.dialogRef.close();
            }
        }, () => {
            this.dialogRef.close();
        });
    }

    loadPieChart() { // Se carga el grafico en el canvas
        const ctxPieChartCanvas = this.pieChartCanvas.nativeElement.getContext('2d');
        const pieData = {
            type: 'pie',
            data: {
                labels: this.getLabels(), // Se obtienen los labels con la función
                datasets: [
                    {
                        data: this.getData(), // Se obtienen los datos con la función
                        backgroundColor: this.getBackgroundColors() // Se obtienen los colores con la función
                    }
                ]
            }, options: {
                responsive: true,
                title: {
                    display: true,
                    text: [
                        'Particição na Receita: ' + this.currencyPipe.transform(this.pieChartData.totalGains, 'BRL'),
                        this.datePipe.transform(this.initialDate, 'MMMM yyyy') + ' - ' +
                        this.datePipe.transform(this.finalDate, 'MMMM yyyy')
                    ]
                }
            }
        };
        this.pieChart = new Chart(ctxPieChartCanvas, pieData);
    }

    getLabels() {
        const labels = []; // Se cargan los labels del gráfico correspondientes a los nombres de los consultores
        for (const consultant of this.pieChartData.consultants) {
            labels.push(consultant.userName);
        }
        return labels;
    }

    getData() {
        const data = [];
        for (const consultant of this.pieChartData.consultants) {
            // se agregan los datos al data set calculando el porcentaje de participación de cada consultor
            data.push(((consultant.gain / this.pieChartData.totalGains) * 100).toFixed(2));
        }
        return data;
    }

    // Función para generar un arreglo de colores aleatorios
    getBackgroundColors() {
        const backgroundColors = [];
        for (let i = 0; i < this.pieChartData.consultants.length; i++) {
            backgroundColors.push(
                'rgba(' +
                Math.floor(Math.random() * 200) + ', ' +
                Math.floor(Math.random() * 200) + ', ' +
                Math.floor(Math.random() * 200) + ', 0.4)'
            );
        }
        return backgroundColors;
    }

}
