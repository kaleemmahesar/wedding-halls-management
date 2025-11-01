// Expense data model
export class Expense {
  constructor({
    id = '',
    bookingId = '',
    title = '',
    category = '',
    amount = 0,
    receiptImage = '' // URL or base64 string of the receipt image
  } = {}) {
    this.id = id;
    this.bookingId = bookingId;
    this.title = title;
    this.category = category;
    this.amount = amount;
    this.receiptImage = receiptImage; // URL or base64 string of the receipt image
  }
}

// Predefined expense categories
export const EXPENSE_CATEGORIES = [
  'Labour Cost',
  'Maintenance',
  'Decoration',
  'Groceries',
  'Other'
];