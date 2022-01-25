import { Component, OnInit } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TokenStorageService } from 'src/app/_services/storage/token-storage.service';
import { UserIDStorageService } from 'src/app/_services/storage/userId-storage.service';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transactions.model';
import { ColumnMode } from "@swimlane/ngx-datatable"

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss']
})
export class AllTransactionsComponent implements OnInit {
  private apiURL = environment.allTransactions;
  public transactions = []

  rows = [];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;

  currentPage = 4;
  page?: number;

  constructor (  public tokenStorageService: TokenStorageService, public userIDStorageService: UserIDStorageService ) { }

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
    console.log(this.tokenStorageService.getToken());
    console.log(reqBody)
    try {
      const options: AxiosRequestConfig = {
        method: 'POST',
        data: reqBody,
        url: this.apiURL,
        headers: {
          Authorization: `Bearer ${this.tokenStorageService.getToken()}`
        }
      };
      console.log(options);
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
      }
    } catch (e) {
      console.error(e);
    }
  }
}
