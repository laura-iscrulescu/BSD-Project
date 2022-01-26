import { Component, OnInit } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import { Chart } from 'chart.js';
import * as moment from 'moment-timezone';
import regression from 'regression';
import { TokenStorageService } from 'src/app/_services/storage/token-storage.service';
import { UserIDStorageService } from 'src/app/_services/storage/userId-storage.service';
import { environment } from 'src/environments/environment';
import _ from 'lodash';

@Component({
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit {
  private allTransactionsURL = environment.allTransactions;
  public labelsLine = [];

  public dataLine:Array<number> = [];

  constructor (public tokenStorageService: TokenStorageService, public userIDStorageService: UserIDStorageService) { }

  async ngOnInit (): Promise<void> {
    const canvas: any = document.getElementById('predictionChart');
    const ctx = canvas.getContext('2d');

    this.labelsLine = []
    for (const month = moment().subtract(12, 'months'); month.isSameOrBefore(moment()); month.add(1, 'month')) {
      this.labelsLine.push(month.format('MMM/YY'));
    }

    const reqBody = {
      user_id: this.userIDStorageService.getUserId()
    }
    try {
      const options: AxiosRequestConfig = {
        method: 'POST',
        data: reqBody,
        url: this.allTransactionsURL,
        headers: {
          Authorization: `Bearer ${this.tokenStorageService.getToken()}`
        }
      };
      let res = await axios(options);
      if (res && res.status === 200) {
        const transactions = res.data;
        const groupedTransactions = _.groupBy(transactions, transaction => moment(transaction.date).format('MMM/YY'));
        this.dataLine = []
        for (const key of this.labelsLine) {
          if (groupedTransactions[key]) {
            this.dataLine.push(_.sumBy(groupedTransactions[key], 'value'));
          } else {
            this.dataLine.push(0);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    if (this.dataLine.length === 0) {
      for (let i = 0; i < this.labelsLine.length; i++) {
        this.dataLine.push(0);
      }
    }

    for (const month = moment().add(1, 'month'); month.isSameOrBefore(moment().add(5, 'months')); month.add(1, 'month')) {
      this.labelsLine.push(month.format('MMM/YY'));
    }

    const aggregatedData = [];
    this.dataLine.forEach((data, index) => {
      aggregatedData.push([index, data]);
    });
    const reg = regression.linear(aggregatedData);

    let predictedData = [];
    reg.points.forEach((val) => predictedData.push(val[1]));
    this.dataLine.push(predictedData[0]);
    predictedData = [...Array(this.dataLine.length - 1), ...predictedData.slice(0, 6)];

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
