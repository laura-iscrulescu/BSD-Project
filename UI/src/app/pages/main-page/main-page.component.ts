import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Chart, ChartItem } from 'chart.js';
import { Category } from '../models/category.model';
// import Chart from 'chart.js';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public currentSpendings = 20;
  public budget = 30;

  public labelsLine = [
    'JUN',
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

  public dataLine = [80, 160, 200, 160, 250, 280, 220, 190, 200, 250, 290, 320];

  public labelsDoughnut = ['Rent', 'Groceries', 'Gas', 'Clothing', 'Gifts', 'Others'];
  public dataDoughtnut = [12, 19, 3, 5, 2, 3];

  public focus1: boolean;
  public focus2: boolean;
  public focus3: boolean;
  public focus4: boolean;
  public focus5: boolean;

  public categories = [
    new Category('Rent'),
    new Category('Groceries')
  ]

  public transactions = [];

  public transactionForm = this.formBuilder.group({
    productName: '',
    price: '',
    date: null,
    category: null
  });

  public categoryForm = this.formBuilder.group({
    categoryName: ''
  });

  public closeTransactionModal = false;
  public closeCategoryModal = false;

  constructor (private formBuilder: FormBuilder) { }

  ngOnInit (): void {
    // charts

    // const ctx = document.getElementById('lineChart') as ChartItem;
    // const ctx = canvas.getContext('2d') as ChartItem;
    // const gradientFill = ctx.createLinearGradient(0, 350, 0, 50);
    // gradientFill.addColorStop(0, 'rgba(228, 76, 196, 0.0)');
    // gradientFill.addColorStop(1, 'rgba(228, 76, 196, 0.14)');
    const canvas: any = document.getElementById('lineChart');
    const ctx = canvas.getContext('2d');
    const gradientFill = ctx.createLinearGradient(0, 350, 0, 50);
    gradientFill.addColorStop(0, 'rgba(228, 76, 196, 0.0)');
    gradientFill.addColorStop(1, 'rgba(228, 76, 196, 0.14)');
    const lineChart = new Chart(canvas, {
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
    const myChart2 = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: this.labelsDoughnut,
        datasets: [{
          data: this.dataDoughtnut,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      }
    });

    // modals
    this.transactionFormInit();
    this.categoryFormInit();
  }

  public onSubmitTransaction (): void {
    this.closeTransactionModal = false;
    console.log(this.transactionForm);

    if (this.transactionForm.valid) {
      console.log('valid');
      const reqBody = {
        productName: this.transactionForm.value.productName,
        price: this.transactionForm.value.price,
        date: this.transactionForm.value.date,
        category: this.transactionForm.value.category
      };
      console.log(reqBody);
      this.closeTransactionModal = true;
      this.transactionFormInit();
    } else {
      console.log('invalid');
    }
  }

  public onSubmitCategory (): void {
    this.closeCategoryModal = false;
    console.log(this.categoryForm);

    if (this.categoryForm.valid) {
      console.log('valid');
      const reqBody = {
        categoryName: this.categoryForm.value.categoryName
      };
      console.log(reqBody);
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
      categoryName: [null, Validators.required]
    });
  }
}
