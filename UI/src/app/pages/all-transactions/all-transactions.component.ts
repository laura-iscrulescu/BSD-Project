import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Transaction } from '../models/transactions.model';

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss']
})
export class AllTransactionsComponent implements OnInit {
  public transactions = [
    new Transaction('water', '11/12/2021', 22, 'Food'),
    new Transaction('gas', '12/12/2022', 320, 'Gas'),
    new Transaction('rent', '02/02/2022', 650, 'Rent')
  ]

  currentPage = 4;
  page?: number;

  constructor () { }

  ngOnInit (): void {
  }

  pageChanged (event: PageChangedEvent): void {
    this.page = event.page;
  }

  // TO DO
//   pageChanged(event: PageChangedEvent): void {
//     const startItem = (event.page - 1) * event.itemsPerPage;
//     const endItem = event.page * event.itemsPerPage;
//     this.returnedArray = this.contentArray.slice(startItem, endItem);
//  }
//  ngOnInit(): void {
//     this.contentArray = this.contentArray.map((v: string, i: number) => {
//        return 'Line '+ (i + 1);
//     });
//     this.returnedArray = this.contentArray.slice(0, 5);
//  }
}
