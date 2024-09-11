import React from 'react';

const EtServiceDoc = ({ etServiceData }) => {
    // Generates the CSS styles for the document
    const generateCSS = () => {
        return `
      body {
        font-family: Arial, sans-serif;
        font-size: 14px;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      @page {
        size: A4;
        margin: 10mm;
      }
      .table {
        width: 100%; /* Adjust width as needed */
        border-collapse: collapse;
        margin-top: 10px;
      }
      .th, .td {
        border: 1px solid #000;
        text-align: left;
        vertical-align: top;
        // padding: 8px;
      }
      .th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      .heading {
        text-align: center;
        background-color: #d9edf7;
        font-weight: bold;
        font-size: 18px;
      }
      h1 {
        text-align: center;
        font-size: 24px;
        margin-bottom: 20px;
      }
    `;
    };

    // Filters data based on the OrderNumber
    const filterDataByOrderNumber = (data, orderNumber) => {
        return data.filter(item => item.orderNumber === orderNumber);
    };

    // Generates table rows for nested arrays like etvestinginfo, etopenmortagedeedinfo, etc.
    const generateNestedTable = (data, headers) => {
        if (!data || data.length === 0) return '<tr><td class="td" colSpan="100%"></td></tr>';
        return data.map(item => `
      <tr>${headers.map(header => `<td class="td">${item[header] || 'N/A'}</td>`).join('')}</tr>
    `).join('');
    };

    // Generates the document and triggers the download
    const etServiceDocFile = () => {
        const cssString = generateCSS();

        // Extract OrderNumber from etServiceData
        const orderNumber = etServiceData.orderNumber;

        // Filter data for each section based on OrderNumber
        const vestingInfo = filterDataByOrderNumber(etServiceData.etvestinginfo, orderNumber);
        const mortgageInfo = filterDataByOrderNumber(etServiceData.etopenmortagedeedinfo, orderNumber);
        const judgmentsAndLiens = filterDataByOrderNumber(etServiceData.etactivejudgmentsandliens, orderNumber);

        const formattedData = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8"></meta>
          <style>${cssString}</style>
        </head>
        <body>
          <h1>ET Service Data</h1>

          <!-- General Information -->
          <table class="table">
            <tr>
              <th class="heading" colSpan="8">GENERAL INFORMATION</th>
            </tr>

            <tr> 
              <th class="th" colSpan="2">Order Number </th>
              <td class="td" colSpan="2">${etServiceData.orderNumber}</td>
              <th class="th" colSpan="2">Reference Number</th>
              <td class="td" colSpan="2">${etServiceData.referenceNumber || ''} </td>
             </tr>

            <tr>
              <th class="th" colSpan="2">Search Date</th>
              <td class="td" colSpan="1">${etServiceData.searchDate || ''}</td>
              <td class="td" colSpan="1"> AS OF 7:30 AM </td>
              <th class="th" colSpan="2">Effective Date</th>
              <td class="td" colSpan="2">${etServiceData.effectiveDate || ''}</td>
            </tr>

            <tr>
              <th class="th" colSpan="2">Property Address</th>
              <td class="td" colSpan="6">${etServiceData.propertyAdderess}</td>
            </tr> 

            <tr>
                <th class="th" colSpan="2">State</th>
                <td class="td" colSpan="2">${etServiceData.state}</td>
                <th class="th" colSpan="2">Country</th>
                <td class="td" colSpan="2">${etServiceData.country}</td>
            </tr>
          
            <tr>
                <th class="th" colSpan="2">Parcel Number</th>
                <td class="td" colSpan="2">${etServiceData.parcelNumber}</td>
                <th class="th" colSpan="2">Subdivision</th>
                <td class="td" colSpan="2">${etServiceData.subDivision}</td>
            </tr>

            <tr> 
              <th class="th" colSpan="2">Lot Unit</th>
              <td class="td" colSpan="2">${etServiceData.lotUnit}</td>
              <th class="th" colSpan="2">Block</th>
              <td class="td" colSpan="2">${etServiceData.block}</td>
            </tr>

            <tr>
               <th class="th" colSpan="2">SFR PUD Condo</th>
               <td class="td" colSpan="6">${etServiceData.sfrPudCondo}</td>
            </tr>
          </table>

          <!-- Vesting Information -->
          <table class="table">
            <tr>
              <th class="heading" colSpan="6">Vesting Information</th>
            </tr>
            <tr>
             
              <th class="th">Consideration Amount</th>
              <th class="th">Deed Type</th>
              <th class="th">Grantor</th>
              <th class="th">Grantee</th>
              <th class="th">Vesting</th>
            </tr>
            ${generateNestedTable(vestingInfo, [ 'considerationAmount', 'deedType', 'grantor', 'grantee', 'vesting'])}
          </table>

          <!-- Mortgage Information -->
          <table class="table">
            <tr>
              <th class="heading" colSpan="6">Mortgage Information</th>
            </tr>
            <tr>
         
              <th class="th">Mortgagor</th>
              <th class="th">Mortgagee</th>
              <th class="th">Trustee</th>
              <th class="th">Amount</th>
              <th class="th">Inst. Book Page</th>
            </tr>
            ${generateNestedTable(mortgageInfo, [ 'mortgagor', 'mortgagee', 'trustee', 'amount', 'instBookPage'])}
          </table>

          <!-- Judgments & Liens -->
          <table class="table">
            <tr>
              <th class="heading" colSpan="4">Judgments & Liens</th>
            </tr>
            <tr>
             
              <th class="th">Case Number</th>
              <th class="th">Description</th>
              <th class="th">Amount</th>
            </tr>
            ${generateNestedTable(judgmentsAndLiens, ['caseNumber', 'description', 'amount'])}
          </table>

        </body>
      </html>
    `;

        // Convert the content to a Blob for downloading as a .doc file
        const blob = new Blob(['\ufeff', formattedData], {
            type: 'application/msword',
        });

        // Create a link element, trigger download, and clean up
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ET_Service_Report.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <button onClick={etServiceDocFile}>Download ET Service Document</button>
        </div>
    );
};

export default EtServiceDoc;
