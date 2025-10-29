import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Function to generate booking report PDF
export const generateBookingReportPDF = (bookings, expenses, title = 'Booking Report') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 105, 20, null, null, 'center');
  
  // Add generation date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Prepare data for the table
  const tableData = bookings.map(booking => {
    // Calculate expenses for this booking
    const bookingExpenses = expenses
      .filter(expense => expense.bookingId === booking.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const profit = booking.totalCost - bookingExpenses;
    
    return [
      booking.id,
      new Date(booking.functionDate).toLocaleDateString(),
      booking.bookingBy,
      `₨${booking.totalCost.toLocaleString()}`,
      `₨${bookingExpenses.toLocaleString()}`,
      `₨${profit.toLocaleString()}`
    ];
  });
  
  // Add table
  doc.autoTable({
    head: [['Booking ID', 'Date', 'Customer', 'Total', 'Expenses', 'Profit']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 10
    },
    headStyles: {
      fillColor: [59, 130, 246] // Blue color
    }
  });
  
  // Add summary
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalCost, 0);
  const totalExpenses = expenses
    .filter(expense => bookings.some(booking => booking.id === expense.bookingId))
    .reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  
  const finalY = doc.lastAutoTable.finalY || 40;
  doc.setFontSize(12);
  doc.text(`Total Revenue: ₨${totalRevenue.toLocaleString()}`, 20, finalY + 10);
  doc.text(`Total Expenses: ₨${totalExpenses.toLocaleString()}`, 20, finalY + 20);
  doc.text(`Net Profit: ₨${netProfit.toLocaleString()}`, 20, finalY + 30);
  
  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Function to generate booking slip PDF
export const generateBookingSlipPDF = (booking, expenses) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Wedding Hall Booking Slip', 105, 20, null, null, 'center');
  doc.setFontSize(16);
  doc.text('Official Receipt', 105, 30, null, null, 'center');
  
  // Add booking information
  doc.setFontSize(12);
  let yPos = 45;
  
  doc.text(`Booking ID: #${booking.id}`, 20, yPos);
  yPos += 10;
  doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleDateString()}`, 20, yPos);
  yPos += 10;
  doc.text(`Function Date: ${new Date(booking.functionDate).toLocaleDateString()}`, 20, yPos);
  yPos += 10;
  doc.text(`Function Type: ${booking.functionType}`, 20, yPos);
  yPos += 10;
  doc.text(`Hall Reserved: ${booking.hallReserved}`, 20, yPos);
  yPos += 10;
  doc.text(`Time: ${booking.startTime} - ${booking.endTime}`, 20, yPos);
  
  // Add customer information
  yPos += 15;
  doc.setFontSize(14);
  doc.text('Customer Information', 20, yPos);
  doc.setFontSize(12);
  yPos += 10;
  doc.text(`Name: ${booking.bookingBy}`, 20, yPos);
  yPos += 10;
  doc.text(`CNIC: ${booking.cnic}`, 20, yPos);
  yPos += 10;
  doc.text(`Contact: ${booking.contactNumber}`, 20, yPos);
  yPos += 10;
  doc.text(`Address: ${booking.address}`, 20, yPos);
  yPos += 10;
  doc.text(`Guests: ${booking.guests}`, 20, yPos);
  
  // Add menu items
  yPos += 15;
  doc.setFontSize(14);
  doc.text('Menu Details', 20, yPos);
  doc.setFontSize(12);
  
  // Prepare menu items table
  const menuData = booking.menuItems.map(item => [
    item.name,
    item.quantity,
    `₨${item.cost.toLocaleString()}`
  ]);
  
  doc.autoTable({
    head: [['Item', 'Quantity', 'Cost (₨)']],
    body: menuData,
    startY: yPos + 5,
    styles: {
      fontSize: 10
    },
    headStyles: {
      fillColor: [59, 130, 246] // Blue color
    }
  });
  
  // Add payment summary
  const finalY = doc.lastAutoTable.finalY || yPos + 30;
  let paymentY = finalY + 15;
  
  doc.setFontSize(14);
  doc.text('Payment Summary', 20, paymentY);
  doc.setFontSize(12);
  paymentY += 10;
  doc.text(`Total Cost: ₨${booking.totalCost.toLocaleString()}`, 20, paymentY);
  paymentY += 10;
  doc.text(`Advance Paid: ₨${booking.advance.toLocaleString()}`, 20, paymentY);
  paymentY += 10;
  doc.text(`Balance: ₨${(booking.totalCost - booking.advance).toLocaleString()}`, 20, paymentY);
  
  // Calculate and add expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = booking.totalCost - totalExpenses;
  
  paymentY += 10;
  doc.text(`Total Expenses: ₨${totalExpenses.toLocaleString()}`, 20, paymentY);
  paymentY += 10;
  doc.setFontSize(14);
  doc.text(`Net Profit: ₨${netProfit.toLocaleString()}`, 20, paymentY);
  
  // Add footer
  const footerY = paymentY + 20;
  doc.setFontSize(10);
  doc.text('Thank you for choosing our wedding hall services!', 105, footerY, null, null, 'center');
  doc.text('For any queries, please contact us at 0300-1234567', 105, footerY + 10, null, null, 'center');
  
  // Save the PDF
  doc.save(`Booking_Slip_${booking.id}_${new Date().toISOString().split('T')[0]}.pdf`);
};