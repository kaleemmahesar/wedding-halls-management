import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, updateExpense, deleteExpense } from '../store/slices/expensesSlice';
import { EXPENSE_CATEGORIES } from '../models/Expense';

const ExpenseModal = ({ bookingId, bookingBy, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const expenses = useSelector(state => state.expenses.expenses);
  const bookingExpenses = expenses.filter(expense => expense.bookingId === bookingId);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [receiptImage, setReceiptImage] = useState(''); // New state for receipt image
  const [imagePreview, setImagePreview] = useState(''); // New state for image preview
  
  // Calculate total expenses for this booking
  const totalExpenses = bookingExpenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const resetForm = () => {
    setTitle('');
    setCategory(EXPENSE_CATEGORIES[0]);
    setAmount('');
    setReceiptImage('');
    setImagePreview('');
    setEditingExpense(null);
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        setReceiptImage(event.target.result); // Store base64 string
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove image
  const removeImage = () => {
    setImagePreview('');
    setReceiptImage('');
  };
  
  const handleAddExpense = (e) => {
    e.preventDefault();
    
    if (!title || !amount) {
      alert('Please fill in all required fields');
      return;
    }
    
    const expenseData = {
      bookingId,
      title,
      category,
      amount: parseFloat(amount),
      receiptImage // Include receipt image
    };
    
    if (editingExpense) {
      dispatch(updateExpense({ id: editingExpense.id, ...expenseData }))
        .then(() => {
          resetForm();
          setIsAdding(false);
          alert('Expense updated successfully!');
        })
        .catch(() => {
          alert('Failed to update expense.');
        });
    } else {
      dispatch(addExpense(expenseData))
        .then(() => {
          resetForm();
          setIsAdding(false);
          alert('Expense added successfully!');
        })
        .catch(() => {
          alert('Failed to add expense.');
        });
    }
  };
  
  const handleEditExpense = (expense) => {
    setTitle(expense.title);
    setCategory(expense.category);
    setAmount(expense.amount);
    setReceiptImage(expense.receiptImage || '');
    setImagePreview(expense.receiptImage || '');
    setEditingExpense(expense);
    setIsAdding(true);
  };
  
  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(expenseId))
        .then(() => {
          alert('Expense deleted successfully!');
        })
        .catch(() => {
          alert('Failed to delete expense.');
        });
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        
        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  Expense Management
                </h3>
                <p className="text-sm text-gray-500 mb-4">Booking: {bookingBy}</p>
                
                <div className="bg-blue-50 p-3 rounded-lg mb-6">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-blue-700">Total Expenses</p>
                  </div>
                  <p className="text-lg font-semibold text-blue-900 mt-1">{formatCurrency(totalExpenses)}</p>
                </div>
                
                <div className="border-b border-gray-200 mb-4">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setIsAdding(false)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        !isAdding 
                          ? 'border-indigo-500 text-indigo-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Expense List
                    </button>
                    <button
                      onClick={() => {
                        resetForm();
                        setIsAdding(true);
                      }}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        isAdding 
                          ? 'border-indigo-500 text-indigo-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {editingExpense ? 'Edit Expense' : 'Add Expense'}
                    </button>
                  </nav>
                </div>
                
                {!isAdding ? (
                  <div>
                    {bookingExpenses.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Receipt
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {bookingExpenses.map((expense) => (
                              <tr key={expense.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {expense.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatCurrency(expense.amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {expense.receiptImage ? (
                                    <img 
                                      src={expense.receiptImage} 
                                      alt="Receipt" 
                                      className="w-12 h-12 object-cover rounded border"
                                    />
                                  ) : (
                                    <span className="text-gray-400 text-sm">No receipt</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleEditExpense(expense)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteExpense(expense.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses</h3>
                        <p className="mt-1 text-sm text-gray-500">No expenses have been recorded for this booking.</p>
                        <div className="mt-6">
                          <button
                            onClick={() => {
                              resetForm();
                              setIsAdding(true);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Expense
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleAddExpense} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter expense title"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {EXPENSE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="1"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    
                    {/* Receipt Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Image (Optional)</label>
                      <div className="flex items-center space-x-4">
                        <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs text-gray-500">Upload</p>
                            </div>
                          )}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={removeImage}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Upload a receipt image (max 2MB)</p>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        {editingExpense ? 'Update Expense' : 'Add Expense'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          resetForm();
                          setIsAdding(false);
                        }}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;