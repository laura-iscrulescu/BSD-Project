import { Component, OnInit } from '@angular/core';
import { Chart, ChartItem } from 'chart.js';
import regression from 'regression';

@Component({
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit {
  public labelsLine = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
  ];

  public dataLine:Array<number> = [80, 160, 200, 160, 250, 280, 220, 190, 200, 250, 290, 320];

  constructor () { }

  ngOnInit (): void {
    const canvas: any = document.getElementById('predictionChart');
    const ctx = canvas.getContext('2d');

    const aggregatedData = [];
    this.dataLine.forEach((data, index) => {
      aggregatedData.push([index, data]);
    });
    const reg = regression.linear(aggregatedData);

    let predictedData = [];
    reg.points.forEach((val) => predictedData.push(val[1]));
    this.dataLine.push(predictedData[0]);
    predictedData = [...Array(this.dataLine.length - 1), ...predictedData.slice(0, 6)];

    this.labelsLine = this.labelsLine.concat(this.labelsLine.slice(0, 6));

    const gradientFill = ctx.createLinearGradient(0, 350, 0, 50);
    gradientFill.addColorStop(0, 'rgba(228, 76, 196, 0.0)');
    gradientFill.addColorStop(1, 'rgba(228, 76, 196, 0.14)');

    const predictionChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.labelsLine,
        datasets: [
          {
            label: 'Total money spent',
            fill: true,
            backgroundColor: gradientFill,
            borderColor: '#e44cc4',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#e44cc4',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#be55ed',
            pointHoverBorderColor: 'rgba(35,46,55,1)',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.dataLine
          },
          {
            label: 'Total money predicted',
            fill: true,
            backgroundColor: gradientFill,
            borderColor: '#e44cc4',
            borderWidth: 2,
            borderDash: [20, 30],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#e44cc4',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#be55ed',
            pointHoverBorderColor: 'rgba(35,46,55,1)',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: predictedData
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            usePointStyle: true,
            callbacks: {
              labelPointStyle: function (context) {
                return {
                  pointStyle: 'triangle',
                  rotation: 0
                };
              }
            }
          }
        }
      }
    });
  }
}
