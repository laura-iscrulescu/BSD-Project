import { Component, OnInit } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TokenStorageService } from 'src/app/_services/storage/token-storage.service';
import { UserIDStorageService } from 'src/app/_services/storage/userId-storage.service';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transactions.model';
import { ColumnMode } from "@swimlane/ngx-datatable"
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss']
})
export class AllTransactionsComponent implements OnInit {
  private apiURL = environment.allTransactions;
  public transactions = []
  public copyTransactions = []

  valueForm = new FormGroup({
    lowerDate: new FormControl(),
    upperDate: new FormControl(),
    lowerValue: new FormControl(),
    upperValue: new FormControl()
  })

  rows = [];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;

  currentPage = 4;
  page?: number;

  constructor (  private formBuilder: FormBuilder, public tokenStorageService: TokenStorageService, public userIDStorageService: UserIDStorageService ) { }

  async ngOnInit (): Promise<void> {
    await this.getAllTransactions();
  }

  pageChanged (event: PageChangedEvent): void {
    this.page = event.page;
  }


  public async getAllTransactions (): Promise<void> {
    const reqBody = {
      user_id: this.userIDStorageService.getUserId()
    }
    try {
      const options: AxiosRequestConfig = {
        method: 'POST',
        data: reqBody,
        url: this.apiURL,
        headers: {
          Authorization: `Bearer ${this.tokenStorageService.getToken()}`
        }
      };
      let res = await axios(options);
      if (res && res.status === 200) {
        this.transactions = [];
        for (const transaction of res.data) {
          this.transactions.push(new Transaction(
            transaction.name,
            transaction.date,
            transaction.value,
            transaction.category
          ));
        }
        this.copyTransactions = this.transactions
      }
    } catch (e) {
      console.error(e);
    }
  }

  public checkDates(): void {
    const lowerDate = this.valueForm.value.lowerDate
    const upperDate = this.valueForm.value.upperDate
    if (lowerDate && upperDate) {
      if (lowerDate > upperDate) {
        this.valueForm.controls['lowerDate'].setValue(upperDate) 
        this.valueForm.controls['upperDate'].setValue(lowerDate)
      }
    }
  }

  public filterElems(): void {
      const lowerDate = this.valueForm.value.lowerDate
      const upperDate = this.valueForm.value.upperDate
      const lowerValue = parseInt(this.valueForm.value.lowerValue)
      const upperValue = parseInt(this.valueForm.value.upperValue)

      let filteredTransactions = this.copyTransactions

      if (lowerDate) {
        filteredTransactions = filteredTransactions.filter(elem => {
          return elem.date >= lowerDate
        })
      }
      if (upperDate) {
        filteredTransactions = filteredTransactions.filter(elem => {
          return elem.date <= upperDate
        })
      }

      if (lowerValue) {
        filteredTransactions = filteredTransactions.filter(elem => {
          return elem.price >= lowerValue
        })
      }
      if (upperValue) {
        filteredTransactions = filteredTransactions.filter(elem => {
          return elem.price <= upperValue
        })
      }
      this.transactions = filteredTransactions
  }

  formatDate(date): string {
    return moment(date).format("DD/MM/YYYY")
  }
}
