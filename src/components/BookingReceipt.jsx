import React from 'react';
import Button from './Button';

const BookingReceipt = ({ booking, onClose }) => {
  // Calculate total cost
  const totalCost = booking.totalCost || 0;
  const advance = booking.advance || 0;
  const balance = totalCost - advance;

  return (
    <div className="bg-white p-2 max-w-3xl mx-auto print:p-1 print:max-w-[78mm] print:mx-auto">
      {/* Print-specific styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 78mm;
            margin: 0;
            padding: 2mm;
            font-size: 4pt;
          }
          .no-print {
            display: none !important;
          }
          .print-small {
            font-size: 4pt;
          }
          .print-medium {
            font-size: 5pt;
          }
          .print-large {
            font-size: 6pt;
          }
        }
      `}</style>

      <div className="print-container">
        <div className="text-center mb-3">
          <h1 className="text-lg font-bold text-gray-900 mb-1 print-medium">Wedding Hall Booking Receipt</h1>
          <p className="text-gray-600 text-xs print-small">Booking Confirmation Details</p>
          <div className="border-b border-gray-300 my-2"></div>
        </div>

        {/* Booking Information */}
        <div className="grid grid-cols-1 gap-2 mb-3">
          <div className="border border-gray-200 rounded p-2 print:p-1">
            <h2 className="text-sm font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-200 print-small">Booking Details</h2>
            <div className="space-y-1">
              <div className="flex justify-between text-xs print-small">
                <span className="text-gray-600">ID:</span>
                <span className="font-medium">#{booking.id.substring(0, 8)}</span>
              </div>
              <div className="flex justify-between text-xs print-small">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(booking.bookingDate || new Date()).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-xs print-small">
                <span className="text-gray-600">By:</span>
                <span className="font-medium">{booking.bookingBy}</span>
              </div>
              <div className="flex justify-between text-xs print-small">
                <span className="text-gray-600">CNIC:</span>
                <span className="font-medium">{booking.cnic}</span>
              </div>
              <div className="flex justify-between text-xs print-small">
                <span className="text-gray-600">Contact:</span>
                <span className="font-medium">{booking.contactNumber}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded p-2 print:p-1">
            <h2 className="text-sm font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-200 print-small">Function Details</h2>
            <div className="space-y-1">
              <div className="flex justify-between text-xs print-small">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{booking.functionType}</span>
              </div>
              <div className="flex justify-between text-xs print-small">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(booking.functionDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-xs print-small">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{booking.startTime} - {booking.endTime}</span>
              </div>
              <div className="flex justify-between text-xs print-small">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">{booking.guests}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mb-3 border border-gray-200 rounded p-2 print:p-1">
          <h2 className="text-sm font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-200 print-small">Menu Items</h2>
          {booking.menuItems && booking.menuItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-1">
              {booking.menuItems.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded p-1 border border-gray-200 print:p-0.5">
                  <span className="text-xs font-medium text-gray-800 print-small">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-xs print-small">No menu items</p>
          )}
        </div>

        {/* Payment Details */}
        <div className="border border-gray-200 rounded p-2 print:p-1 mb-3">
          <h2 className="text-sm font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-200 print-small">Payment Details</h2>
          <div className="space-y-1">
            <div className="flex justify-between text-xs print-small">
              <span className="text-gray-600">Per Head:</span>
              <span className="font-medium">₨{booking.costPerHead?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between text-xs print-small">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-gray-900">₨{totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs print-small">
              <span className="text-gray-600">Advance:</span>
              <span className="font-medium text-green-600">₨{advance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-gray-200 text-xs print-small">
              <span className="text-gray-600 font-medium">Balance:</span>
              <span className="font-bold text-gray-900">₨{balance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-xs print-small mb-2">
          <p>Thank you for choosing our services!</p>
          <p className="mt-1">{booking.contactNumber}</p>
        </div>

        {/* Action Buttons - Hidden when printing */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 no-print">
          <Button 
            variant="primary" 
            onClick={() => window.print()}
            className="w-full sm:w-auto py-1 px-3 text-sm"
          >
            Print Receipt
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="w-full sm:w-auto py-1 px-3 text-sm"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingReceipt;