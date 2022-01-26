import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import axios, { AxiosRequestConfig } from 'axios';
import { TokenStorageService } from 'src/app/_services/storage/token-storage.service';
import { UserIDStorageService } from 'src/app/_services/storage/userId-storage.service';
import { environment } from 'src/environments/environment';
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

  constructor (public tokenStorageService: TokenStorageService, public userIDStorageService: UserIDStorageService) { }

  async ngOnInit(): Promise<void> {
    await this.getAllCategories();
    await this.getAllTransactions();

    if (this.categories.length) {
      this.myForm.get('category').setValue(this.categories[0].name);
      this.selectChange();
    }
  }

  public async getAllCategories (): Promise<void> {
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

  public async getAllTransactions (): Promise<void> {
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
  }

  formatDate(date): string {
    return moment(date).format("DD/MM/YYYY")
  }
}
