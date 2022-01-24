export class Transaction {
    productName: string;
    date: Date;
    price: number;
    category: string;

    constructor (productName, date, price, category) {
      this.productName = productName;
      this.date = date;
      this.price = price;
      this.category = category;
    }
}
