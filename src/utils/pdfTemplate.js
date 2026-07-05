import { formatCurrency, lineTotal, calcSubtotal, calcTax, calcDiscount, calcGrandTotal, calcTotalQuantity, numberToWords } from './calculations';

/**
 * Generate Bill of Supply HTML matching traditional Indian invoice format
 */
export const generateInvoiceHTML = (items, settings) => {
  const subtotal = calcSubtotal(items);
  const tax = calcTax(subtotal, settings.taxRate);
  const discount = calcDiscount(subtotal, settings.discountType, settings.discountValue);
  const grandTotal = calcGrandTotal(items, settings.taxRate, settings.discountType, settings.discountValue);
  const totalQty = calcTotalQuantity(items);
  const received = parseFloat(settings.receivedAmount) || 0;
  const balance = grandTotal - received;

  // Build item rows (max ~10 visible, rest overflow)
  const itemRows = items
    .map(
      (item, index) => `
      <tr>
        <td class="center">${index + 1}</td>
        <td class="item-name"><strong>${item.name.toUpperCase()}</strong></td>
        <td class="center">${item.hsnSac || ''}</td>
        <td class="right">${item.quantity}</td>
        <td class="center">${item.unit}</td>
        <td class="right">${formatCurrency(item.price)}</td>
        <td class="right">${formatCurrency(lineTotal(item))}</td>
      </tr>
    `
    )
    .join('');

  // Add empty rows to fill the table (minimum 6 visible rows)
  const emptyRows = Math.max(0, 6 - items.length);
  const emptyRowsHTML = Array(emptyRows)
    .fill('')
    .map(() => `
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Invoice ${settings.invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
          color: #333;
          background: #fff;
          padding: 20px 30px;
          font-size: 13px;
          line-height: 1.4;
        }

        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #ccc;
        }

        /* === HEADER BANNER === */
        .header-banner {
          background: #8a8a8a;
          color: #fff;
          text-align: center;
          padding: 16px 20px 12px;
        }

        .header-banner h1 {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .header-banner p {
          font-size: 12px;
          margin: 1px 0;
        }

        /* === BILL TITLE === */
        .bill-title {
          text-align: center;
          padding: 14px 0 10px;
          font-size: 18px;
          font-weight: bold;
          font-style: italic;
        }

        /* === BILL TO / INVOICE DETAILS === */
        .info-bar {
          display: flex;
          border: 1px solid #999;
          margin: 0 15px;
        }

        .info-bar .label-row {
          display: flex;
          background: #b0b0b0;
          color: #000;
          font-weight: bold;
          font-size: 12px;
        }

        .info-bar .label-row .left {
          flex: 1;
          padding: 4px 10px;
          border-right: 1px solid #999;
        }

        .info-bar .label-row .right {
          width: 200px;
          padding: 4px 10px;
          text-align: right;
        }

        .info-content {
          display: flex;
          border: 1px solid #999;
          border-top: none;
          margin: 0 15px;
          min-height: 40px;
        }

        .info-content .left {
          flex: 1;
          padding: 6px 10px;
          font-weight: bold;
          font-size: 13px;
          border-right: 1px solid #999;
        }

        .info-content .right {
          width: 200px;
          padding: 6px 10px;
          text-align: right;
          font-size: 12px;
        }

        .info-content .right p {
          margin: 2px 0;
        }

        /* === ITEMS TABLE === */
        .items-table-wrapper {
          margin: 12px 15px 0;
        }

        table.items-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #999;
        }

        table.items-table thead th {
          background: #b0b0b0;
          color: #000;
          font-weight: bold;
          font-size: 12px;
          padding: 6px 8px;
          border: 1px solid #999;
          text-align: center;
        }

        table.items-table tbody td {
          padding: 6px 8px;
          border: 1px solid #ccc;
          font-size: 12px;
          vertical-align: top;
        }

        table.items-table .center { text-align: center; }
        table.items-table .right { text-align: right; }
        table.items-table .item-name { text-align: left; min-width: 150px; }

        /* Total Row */
        table.items-table tfoot td {
          padding: 8px 8px;
          border: 1px solid #999;
          font-size: 13px;
          font-weight: bold;
        }

        /* === BOTTOM SECTION === */
        .bottom-section {
          display: flex;
          margin: 0 15px;
          gap: 0;
        }

        .bottom-left {
          flex: 1;
          border: 1px solid #999;
          border-right: none;
        }

        .bottom-right {
          width: 320px;
          border: 1px solid #999;
        }

        /* Amount in words */
        .amount-words-header {
          background: #b0b0b0;
          color: #000;
          font-weight: bold;
          font-size: 12px;
          padding: 4px 10px;
          border-bottom: 1px solid #999;
        }

        .amount-words-content {
          padding: 8px 10px;
          font-size: 12px;
          min-height: 36px;
          border-bottom: 1px solid #999;
        }

        /* Terms */
        .terms-header {
          background: #b0b0b0;
          color: #000;
          font-weight: bold;
          font-size: 12px;
          padding: 4px 10px;
          border-bottom: 1px solid #999;
        }

        .terms-content {
          padding: 8px 10px;
          font-size: 12px;
          min-height: 36px;
        }

        /* Amounts table */
        .amounts-table {
          width: 100%;
          border-collapse: collapse;
        }

        .amounts-table td {
          padding: 6px 10px;
          font-size: 12px;
          border-bottom: 1px solid #ccc;
        }

        .amounts-table .label-cell {
          text-align: left;
        }

        .amounts-table .value-cell {
          text-align: right;
        }

        .amounts-table .total-row td {
          font-size: 14px;
          font-weight: bold;
          border-bottom: 1px solid #999;
        }

        /* === SIGNATURE === */
        .signature-section {
          margin: 20px 15px 15px;
          text-align: right;
          padding-right: 20px;
        }

        .signature-section .for-text {
          font-size: 13px;
          margin-bottom: 40px;
        }

        .signature-section .sig-label {
          font-size: 12px;
          font-weight: bold;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- HEADER BANNER -->
        <div class="header-banner">
          <h1>${(settings.businessName || 'MY BUSINESS').toUpperCase()}</h1>
          ${settings.businessAddress ? `<p>Address: ${settings.businessAddress}${settings.businessPhone ? `, Ph. no.: ${settings.businessPhone}` : ''}</p>` : ''}
          ${settings.businessState ? `<p>State: ${settings.businessState}</p>` : ''}
        </div>

        <!-- BILL TITLE -->
        <div class="bill-title">${settings.invoiceTitle || 'Bill of Supply'}</div>

        <!-- BILL TO / INVOICE DETAILS BAR -->
        <div style="margin: 0 15px;">
          <div style="display: flex; background: #b0b0b0; border: 1px solid #999;">
            <div style="flex: 1; padding: 4px 10px; font-weight: bold; font-size: 12px; border-right: 1px solid #999;">Bill To</div>
            <div style="width: 200px; padding: 4px 10px; font-weight: bold; font-size: 12px; text-align: right;">Invoice Details</div>
          </div>
          <div style="display: flex; border: 1px solid #999; border-top: none; min-height: 44px;">
            <div style="flex: 1; padding: 6px 10px; border-right: 1px solid #999;">
              <strong style="font-size: 13px;">${settings.customerName || ''}</strong>
              ${settings.customerAddress ? `<br><span style="font-size: 11px;">${settings.customerAddress}</span>` : ''}
              ${settings.customerEmail ? `<br><span style="font-size: 11px;">${settings.customerEmail}</span>` : ''}
            </div>
            <div style="width: 200px; padding: 6px 10px; text-align: right; font-size: 12px;">
              <p>Invoice No.: ${settings.invoiceNumber}</p>
              <p>Date: ${settings.invoiceDate}</p>
            </div>
          </div>
        </div>

        <!-- ITEMS TABLE -->
        <div class="items-table-wrapper">
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 35px;">#</th>
                <th>Item Name</th>
                <th style="width: 80px;">HSN/ SAC</th>
                <th style="width: 70px;">Quantity</th>
                <th style="width: 55px;">Unit</th>
                <th style="width: 90px;">Price/ Unit</th>
                <th style="width: 100px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
              ${emptyRowsHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2"></td>
                <td class="center" style="font-weight:bold;">Total</td>
                <td class="right">${totalQty % 1 === 0 ? totalQty : totalQty.toFixed(1)}</td>
                <td></td>
                <td></td>
                <td class="right" style="font-size: 13px;">${formatCurrency(subtotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- BOTTOM SECTION -->
        <div class="bottom-section" style="margin-top: 8px;">
          <!-- LEFT: Amount in Words + Terms -->
          <div class="bottom-left">
            <div class="amount-words-header">Invoice Amount In Words</div>
            <div class="amount-words-content">${numberToWords(grandTotal)}</div>
            <div class="terms-header">Terms and conditions</div>
            <div class="terms-content">${settings.termsAndConditions || 'Thank you for doing business with us.'}</div>
          </div>

          <!-- RIGHT: Amounts -->
          <div class="bottom-right">
            <table class="amounts-table">
              <tr class="label-row-header" style="background: #b0b0b0;">
                <td style="font-weight: bold; border-bottom: 1px solid #999;">Amounts</td>
                <td style="border-bottom: 1px solid #999;"></td>
              </tr>
              <tr>
                <td class="label-cell">Sub Total</td>
                <td class="value-cell">${formatCurrency(subtotal)}</td>
              </tr>
              ${parseFloat(settings.taxRate) > 0 ? `
              <tr>
                <td class="label-cell">Tax (${settings.taxRate}%)</td>
                <td class="value-cell">${formatCurrency(tax)}</td>
              </tr>` : ''}
              ${parseFloat(settings.discountValue) > 0 ? `
              <tr>
                <td class="label-cell">Discount ${settings.discountType === 'percentage' ? `(${settings.discountValue}%)` : ''}</td>
                <td class="value-cell">-${formatCurrency(discount)}</td>
              </tr>` : ''}
              <tr class="total-row">
                <td class="label-cell">Total</td>
                <td class="value-cell"><strong>${formatCurrency(grandTotal)}</strong></td>
              </tr>
              <tr>
                <td class="label-cell">Received</td>
                <td class="value-cell">${formatCurrency(received)}</td>
              </tr>
              <tr>
                <td class="label-cell">Balance</td>
                <td class="value-cell">${formatCurrency(balance)}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- SIGNATURE -->
        <div class="signature-section">
          <div class="for-text">For: ${(settings.businessName || 'MY BUSINESS').toUpperCase()}</div>
          <div class="sig-label">Authorized Signatory</div>
        </div>
      </div>
    </body>
    </html>
  `;
};
