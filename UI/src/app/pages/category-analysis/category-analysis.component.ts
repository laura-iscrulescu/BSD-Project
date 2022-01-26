import { Component, OnInit, NgModule, ChangeDetectorRef } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Category } from '../models/category.model';
import { Transaction } from '../models/transactions.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-category-analysis',
  templateUrl: './category-analysis.component.html',
  styleUrls: ['./category-analysis.component.scss']
})
export class CategoryAnalysisComponent implements OnInit {
  public categories = [
    new Category('Rent'),
    new Category('Gas'),
    new Category('Food')
  ]

  public transactions = [
    new Transaction('water', '11/12/2021', 22, 'Food'),
    new Transaction('gas', '12/12/2022', 320, 'Gas'),
    new Transaction('rent', '02/02/2022', 650, 'Rent'),
    new Transaction('water', '12/12/2021', 22, 'Food'),
    new Transaction('gas', '13/12/2022', 320, 'Gas'),
    new Transaction('rent', '03/02/2022', 650, 'Rent'),
    new Transaction('water', '11/11/2021', 22, 'Food'),
    new Transaction('gas', '12/11/2022', 320, 'Gas'),
    new Transaction('rent', '02/01/2022', 650, 'Rent')
  ]

  public activeCategory: Category;
  public panelOpenState = false;
  public currentTransactions = [];
  public monthlyTransactions = {};
  public spendingByCategory = {};

  public lineChart;

  constructor () { }

  ngOnInit (): void {
    this.activeCategory = this.categories[0];
    this.getTransactionsFromCategory();
  }

  public selectCategory (event) {
    this.activeCategory = event.source.value;
    this.monthlyTransactions = {};
    this.spendingByCategory = {};
    this.getTransactionsFromCategory();
  }

  private getTransactionsFromCategory () {
    this.currentTransactions = this.transactions.filter((transaction: Transaction) => transaction.category === this.activeCategory.categoryName);
    this.currentTransactions.forEach((transaction) => {
      const month = parseInt(transaction.date.split('/')[1]);
      if (!this.monthlyTransactions[month]) this.monthlyTransactions[month] = [];
      this.monthlyTransactions[month].push(transaction);

      if (!this.spendingByCategory[month]) this.spendingByCategory[month] = 0;
      this.spendingByCategory[month] += transaction.price;
    });
    this.chartConfig();
  }

  private chartConfig () {
    if (this.lineChart) { this.lineChart.destroy(); }

    const labels = Object.keys(this.spendingByCategory);
    const data = Object.values(this.spendingByCategory);
    console.log(labels);
    console.log(data);

    const canvas: any = document.getElementById('lineChart');
    const ctx = canvas.getContext('2d');
    const gradientFill = ctx.createLinearGradient(0, 350, 0, 50);
    gradientFill.addColorStop(0, 'rgba(228, 76, 196, 0.0)');
    gradientFill.addColorStop(1, 'rgba(228, 76, 196, 0.14)');
    this.lineChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
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
            data: data
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
