import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Transaction } from '../../models/transactions.model';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit {
  @Input() monthlyTransactions = {};

  constructor () { }

  ngOnInit (): void {
  }
}
