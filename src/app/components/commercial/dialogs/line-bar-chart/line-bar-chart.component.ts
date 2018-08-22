import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import * as Chart from 'chart.js';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '../../../../services/api.service';
import {LineBarChartData} from '../../../../models/lineBarChartData';

@Component({
    selector: 'app-line-bar-chart',
    templateUrl: './line-bar-chart.component.html',
    styleUrls: ['./line-bar-chart.component.scss']
})
export class LineBarChartComponent implements OnInit {

    @ViewChild('LineBarChart') lineBarChartCanvas;
    lineBarChart;
    initialDate;
    finalDate;
    arrayConsultants: string[] = [];
    lineBarChartData: LineBarChartData;

    constructor(public dialogRef: MatDialogRef<LineBarChartComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private apiService: ApiService,
                private currencyPipe: CurrencyPipe,
                private datePipe: DatePipe) {
        // Se obtienen los datos de fechas y arreglo de consultores desde el componente que cargo este
        this.initialDate = this.data.initialDate;
        this.finalDate = this.data.finalDate;
        this.arrayConsultants = this.data.arrayConsultants;
    }

    ngOnInit() {
        const minDate = this.initialDate.getFullYear() + '-' + (this.initialDate.getMonth() + 1) + '-1';
        const maxDate = this.finalDate.getFullYear() + '-' + (this.finalDate.getUTCMonth() + 1) + '-31';
        // Se obtienen desde la api los datos requeridos para general el gráfico
        this.apiService.getDataForBarChart(this.arrayConsultants, minDate, maxDate).subscribe(response => {
            if (response.success) {
                this.lineBarChartData = response.data;
                this.loadLineBarChart();
            } else {
                this.dialogRef.close();
            }
        }, () => {
            this.dialogRef.close();
        });
    }

    loadLineBarChart() { // Se carga el grafico mixto en el canvas del gráfico
        const ctxLineBarChartCanvas = this.lineBarChartCanvas.nativeElement.getContext('2d');
        const chartData = {
            type: 'bar',
            data: {
                labels: this.getLabels(), // Se obtienen los valores que tendra el eje x
                // Se obtiene el dataset del grafico correspondiente a cada consultor y la linea costo fijo medio
                datasets: this.getDataset(),
            },
            options: {
                maintainAspectRatio: false,
                aspectRatio: 0.9,
                responsive: true,
                title: {
                    display: true,
                    text: [
                        'Performance Comercial',
                        this.datePipe.transform(this.initialDate, 'MMMM yyyy') + ' a ' +
                        this.datePipe.transform(this.finalDate, 'MMMM yyyy')
                    ]
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            let label = data.datasets[tooltipItem.datasetIndex].label || '';

                            if (label) {
                                label += ': R$ ';
                            }
                            label += Math.round(tooltipItem.yLabel * 100) / 100;
                            return label;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        min: 0
                    }],
                    yAxes: [{
                        type: 'linear',
                        min: 0,
                        ticks: {
                            callback: function(value, index, values) {
                                return 'R$ ' + value;
                            }
                        }
                    }]
                }
            }
        };
        this.lineBarChart = new Chart(ctxLineBarChartCanvas, chartData);
    }

    getLabels() {
        const labels = [];
        for (const period of this.lineBarChartData.periods) {
            labels.push(this.datePipe.transform(new Date(period.year, period.month + 1), 'MMM yy')); // Se agrega la fecha con formato
        }
        return labels;
    }

    getDataset() {
        const dataset = [];
        for (const consultant of this.lineBarChartData.consultants) { // Se añaden los datos de cada consultor al dataset
            dataset.push({
                label: consultant.userName,
                data: consultant.data,
                backgroundColor: 'rgba(' +
                Math.floor(Math.random() * 200) + ', ' +
                Math.floor(Math.random() * 200) + ', ' +
                Math.floor(Math.random() * 200) + ', 0.2)'
            });
        }
        const dataLine = []; // Se cargan los datos de la linea de tiempo para luego agregarla al dataset
        for (let i = 0; i < this.lineBarChartData.periods.length; i++) {
            dataLine.push(this.lineBarChartData.meanFixedCost);
        }
        dataset.push({
            type: 'line',
            label: 'Custo Fixo Médio',
            data: dataLine,
            borderColor: 'red',
            backgroundColor: 'transparent'
        });
        return dataset;
    }

}
