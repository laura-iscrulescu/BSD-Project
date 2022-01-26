export class Transaction {
    _id: string;
    productName: string;
    date: Date;
    price: number;
    category: string;

    constructor (_id, productName, date, price, category) {
      this._id = _id
      this.productName = productName;
      this.date = date;
      this.price = price;
      this.category = category;
    }
}
