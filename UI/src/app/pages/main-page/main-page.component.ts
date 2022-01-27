import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Chart, ChartItem } from 'chart.js';
import axios, { AxiosRequestConfig } from 'axios';
import { UserIDStorageService } from 'src/app/_services/storage/userId-storage.service';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from 'src/app/_services/storage/token-storage.service';
import _ from 'lodash';
import * as moment from 'moment-timezone';
// import Chart from 'chart.js';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  private getUserURL = environment.getGoal;
  private allTransactionsURL = environment.allTransactions;
  private allCategoriesURL = environment.allCategories;
  private addTransactionURL = environment.addTransaction;
  private addCategoryURL = environment.addCategory;

  private doguhnutChart: Chart | null = null;
  private lineChart: Chart | null = null;

  public currentSpendings = 0;
  public budget = 0;

  public labelsLine = [];
  public dataLine = [];

  public labelsDoughnut = [];
  public dataDoughtnut = [];
  public doughtnutBackgroundColor = [];
  public doughtnutBorderColor = [];

  public focus1: boolean;
  public focus2: boolean;
  public focus3: boolean;
  public focus4: boolean;
  public focus5: boolean;

  public categories = []
  public transactions = [];

  public transactionForm = this.formBuilder.group({
    productName: '',
    price: '',
    date: null,
    category: null
  });

  public categoryForm = this.formBuilder.group({
    categoryName: '',
    categoryColor: 0
  });

  public closeTransactionModal = false;
  public closeCategoryModal = false;

  constructor (private formBuilder: FormBuilder, public tokenStorageService: TokenStorageService, public userIDStorageService: UserIDStorageService) { }

  async ngOnInit (): Promise<void> {
    await this.getGoal();
    await this.getAllCategories();
    await this.getAllTransactions();

    // initialize charts data & labels
    this.updateDoughtnutChart();
    this.updateLineChart();

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

    const ctx2 = document.getElementById('donutChart') as ChartItem;
    this.doguhnutChart = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: this.labelsDoughnut,
        datasets: [{
          data: this.dataDoughtnut,
          backgroundColor: this.doughtnutBackgroundColor,
          borderColor: this.doughtnutBorderColor,
          borderWidth: 1
        }]
      }
    });

    // modals
    this.transactionFormInit();
    this.categoryFormInit();
  }

  public async onSubmitTransaction (): Promise<void> {
    this.closeTransactionModal = false;

    if (this.transactionForm.valid) {
      const reqBody = {
        name: this.transactionForm.value.productName,
        value: this.transactionForm.value.price,
        date: this.transactionForm.value.date,
        category: this.transactionForm.value.category,
        user_id: this.userIDStorageService.getUserId()
      };
      try {
        const options: AxiosRequestConfig = {
          method: 'POST',
          data: reqBody,
          url: this.addTransactionURL,
          headers: {
            Authorization: `Bearer ${this.tokenStorageService.getToken()}`
          }
        };
        const res = await axios(options);
        if (res && res.status === 200) {
          if (res.data) {
            this.transactions.push(res.data);

            this.updateDoughtnutChart();
            this.updateLineChart();
          }
        }
      } catch (e) {
        console.error(e);
      }
      this.closeTransactionModal = true;
      this.transactionFormInit();
    } else {
      console.log('invalid');
    }
  }

  public async onSubmitCategory (): Promise<void> {
    this.closeCategoryModal = false;
    if (this.categoryForm.valid) {
      const reqBody = {
        user_id: this.userIDStorageService.getUserId(),
        name: this.categoryForm.value.categoryName,
        color: this.hexToRgb(this.categoryForm.value.categoryColor)
      };
      try {
        const options: AxiosRequestConfig = {
          method: 'POST',
          data: reqBody,
          url: this.addCategoryURL,
          headers: {
            Authorization: `Bearer ${this.tokenStorageService.getToken()}`
          }
        };
        const res = await axios(options);
        if (res && res.status === 200) {
          if (res.data) {
            this.categories.push(res.data);
            this.updateDoughtnutChart();
          }
        }
      } catch (e) {
        console.error(e);
      }
      this.closeCategoryModal = true;
      this.categoryFormInit();
    } else {
      console.log('invalid');
    }
  }

  public transactionFormInit (): void {
    this.transactionForm = this.formBuilder.group({
      productName: [null, Validators.required],
      price: [null, Validators.required],
      date: [null, Validators.required],
      category: [null, Validators.required]
    });
  }

  public categoryFormInit (): void {
    this.categoryForm = this.formBuilder.group({
      categoryName: [null, Validators.required],
      categoryColor: [null, Validators.required]
    });
  }

  public async getAllTransactions (): Promise<void> {
    const reqBody = {
      user_id: this.userIDStorageService.getUserId()
    };
    try {
      const options: AxiosRequestConfig = {
        method: 'POST',
        data: reqBody,
        url: this.allTransactionsURL,
        headers: {
          Authorization: `Bearer ${this.tokenStorageService.getToken()}`
        }
      };
      const res = await axios(options);
      if (res && res.status === 200) {
        this.transactions = res.data;
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async getAllCategories (): Promise<void> {
    const reqBody = {
      user_id: this.userIDStorageService.getUserId()
    };
    try {
      const options: AxiosRequestConfig = {
        method: 'POST',
        data: reqBody,
        url: this.allCategoriesURL,
        headers: {
          Authorization: `Bearer ${this.tokenStorageService.getToken()}`
        }
      };
      const res = await axios(options);
      if (res && res.status === 200) {
        this.categories = res.data;
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async getGoal (): Promise<void> {
    try {
      const options: AxiosRequestConfig = {
        method: 'POST',
        url: this.getUserURL,
        headers: {
          Authorization: `Bearer ${this.tokenStorageService.getToken()}`
        }
      };
      const res = await axios(options);
      if (res && res.status === 200) {
        const user = JSON.parse(res.data.Resp);
        this.budget = user.goal;
      }
    } catch (e) {
      console.error(e);
    }
  }

  public updateDoughtnutChart (): void {
    this.dataDoughtnut = [];
    this.doughtnutBackgroundColor = [];
    this.doughtnutBorderColor = [];

    const groupedTransactions = _.groupBy(this.transactions, 'category');
    const groupedCategories = _.groupBy(this.categories, 'name');
    this.labelsDoughnut = Object.keys(groupedTransactions);

    for (const key in groupedTransactions) {
      this.dataDoughtnut.push(_.sumBy(groupedTransactions[key], 'value'));
    }

    for (const key in groupedTransactions) {
      const category = groupedCategories[key][0];
      this.doughtnutBackgroundColor.push(`rgba(${category.color.r}, ${category.color.g}, ${category.color.b}, 0.2)`);
      this.doughtnutBorderColor.push(`rgba(${category.color.r}, ${category.color.g}, ${category.color.b}, 1)`);
    }

    this.currentSpendings = _.sumBy(this.transactions, 'value');

    if (!this.currentSpendings) {
      this.currentSpendings = 0;
    }

    if (this.doguhnutChart) {
      this.doguhnutChart.data.labels = this.labelsDoughnut;
      this.doguhnutChart.data.datasets = [{
        data: this.dataDoughtnut,
        backgroundColor: this.doughtnutBackgroundColor,
        borderColor: this.doughtnutBorderColor,
        borderWidth: 1
      }];
      this.doguhnutChart.update();
    }
  }

  public hexToRgb (hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
      : null;
  }

  public updateLineChart (): void {
    this.labelsLine = [];
    this.dataLine = [];

    for (let day = moment().subtract(30, 'days'); day.isSameOrBefore(moment()); day.add(1, 'days')) {
      this.labelsLine.push(day.format('DD/MM'));
    }

    const groupedTransactions = _.groupBy(this.transactions, transaction => moment(transaction.date).format('DD/MM'));

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
