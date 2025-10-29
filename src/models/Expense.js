// Expense data model
export class Expense {
  constructor({
    id = '',
    bookingId = '',
    title = '',
    category = '',
    amount = 0
  } = {}) {
    this.id = id;
    this.bookingId = bookingId;
    this.title = title;
    this.category = category;
    this.amount = amount;
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