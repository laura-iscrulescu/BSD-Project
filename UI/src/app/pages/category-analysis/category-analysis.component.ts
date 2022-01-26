import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import axios, { AxiosRequestConfig } from 'axios';
import { TokenStorageService } from 'src/app/_services/storage/token-storage.service';
import { UserIDStorageService } from 'src/app/_services/storage/userId-storage.service';
import { environment } from 'src/environments/environment';
import { Chart, ChartItem } from 'chart.js';
import _ from "lodash"
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-category-analysis',
  templateUrl: './category-analysis.component.html',
  styleUrls: ['./category-analysis.component.scss']
})
export class CategoryAnalysisComponent implements OnInit {
  private allCategoriesURL = environment.allCategories;
  private allTransactionsURL = environment.allTransactions;

  myForm = new FormGroup({
    category: new FormControl("")
  })
  categories = []
  transactions = []
  
  accordionElements = []

  lineChart = null
  labelsLine = [];
  dataLine = [];

  constructor(public tokenStorageService: TokenStorageService, public userIDStorageService: UserIDStorageService) { }

  async ngOnInit(): Promise<void> {
    await this.getAllCategories();
    await this.getAllTransactions();

    if (this.categories.length) {
      this.myForm.get('category').setValue(this.categories[0].name);
      this.selectChange();
      const canvas: any = document.getElementById('lineChart');
      const ctx = canvas.getContext('2d');
      const gradientFill = ctx.createLinearGradient(0, 350, 0, 50);
      gradientFill.addColorStop(0, 'rgba(228, 76, 196, 0.0)');
      gradientFill.addColorStop(1, 'rgba(228, 76, 196, 0.14)');
      this.lineChart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: this.labelsLine,
          datasets: [
            {
              label: 'Total money spent in this category',
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

  public async getAllCategories(): Promise<void> {
    const reqBody = {
      user_id: this.userIDStorageService.getUserId()
    }
    try {
      const options: AxiosRequestConfig = {
        method: 'POST',
        data: reqBody,
        url: this.allCategoriesURL,
        headers: {
          Authorization: `Bearer ${this.tokenStorageService.getToken()}`
        }
      };
      let res = await axios(options);
      if (res && res.status === 200) {
        this.categories = res.data
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async getAllTransactions(): Promise<void> {
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
        this.transactions = res.data
      }
    } catch (e) {
      console.error(e);
    }
  }

  selectChange() {
    const { category } = this.myForm.value;
    const filteredTransactions = this.transactions.filter((transaction) => transaction.category === category)
    const groupedTransactions = _.groupBy(filteredTransactions, transaction => moment(transaction.date).format("MMMM YYYY"))

    this.accordionElements = []
    for (const key in groupedTransactions) {
      this.accordionElements.push({
        label: `${category} | ${key} | Total: ${_.sumBy(groupedTransactions[key], 'value')}$`,
        transactions: JSON.parse(JSON.stringify(groupedTransactions[key]))
      })
    }

    this.updateLineChart();
  }

  formatDate(date): string {
    return moment(date).format("DD/MM/YYYY")
  }

  public updateLineChart(): void {
    this.labelsLine = [];
    this.dataLine = [];

    for (let month = moment().subtract(12, 'months'); month.isSameOrBefore(moment()); month.add(1, 'month')) {
      this.labelsLine.push(month.format('MM/YY'));
      
    }

    const groupedTransactions = _.groupBy(this.transactions, transaction => moment(transaction.date).format("MM/YY"));

    for (const key of this.labelsLine) {
      const dailyTransactions = groupedTransactions[key];
      if (dailyTransactions) {
        this.dataLine.push(_.sumBy(dailyTransactions, 'value'));
      } else {
        this.dataLine.push(0);
      }
    }

    if (this.lineChart) {
      this.lineChart.data.labels = this.labelsLine;
      if (this.lineChart.data.datasets.length) {
        this.lineChart.data.datasets[0].data = this.dataLine;
      }
      this.lineChart.update();
    }
  }
}
