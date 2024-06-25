import React from 'react'
import 'primereact/resources/themes/saga-blue/theme.css';  // Or any other theme you prefer
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import "./EtServices.css"
import { Button } from 'primereact/button';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';

function EtServices() {
//GAyathri
  const onSubmit = async (e) => {
    //Gayathri 10101
    e.preventDefault();
    try {

      const token = localStorage.getItem('token');

      const payload = {
        etgeneralinfo: {
          orderNumber: orderNumber,
          refeenceNumber: refeenceNumber,
          searchDate: searchDate,
          effectiveDate: effectiveDate,
          propertyAdderess: propertyAdderess,
          state: state,
          country: country,
          parcelNumber: parcelNumber,
          subDivision: subDivision,
          lotUnit: lotUnit,
          block: block,
          sfrPudCondo: sfrPudCondo,
          etvestinginfo: tablesData.map(table => ({ indicator: table.indicator, ...table.data })),
          etopenmortagedeedinfo: tablesData2.map(table => ({ indicator: table.indicator, ...table.data })),
          etactivejudgmentsandliens: tableRowsData.map(row => ({ ...row.data })),
          ettaxinformation: [
            {
              landValue: landValue,
              buildingValue: buildingValue,
              totalValue: buildingValue,
              excemption: excemption,
              notes: notes
            }
          ],
          etnameruns: nameRunData.map(row => ({ ...row.data })),
          ettaxinstallment: tableTaxInstaData.map(row => ({ ...row.data })),
        }
      };
      await axios.post("http://localhost:8080/etinsert", payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      window.alert("Data Sent Sucessfully");


    } catch (error) {
      console.error("Registration failed:", error);
      window.alert("Data Not Sent Somthing went Wrong"); // Handle error if registration fails

    }
  };

  const [user, setUser] = useState({

    orderNumber: "",
    refeenceNumber: "",
    searchDate: "",
    effectiveDate: "",
    propertyAdderess: "",
    state: "",
    country: "",
    parcelNumber: "",
    subDivision: "",
    lotUnit: "",
    block: "",
    sfrPudCondo: "",
  })

  const [taxinfo, setTaxInfo] = useState({
    landValue: "",
    buildingValue: "",
    totalValue: "",
    excemption: "",
    notes: "",
  })

  const { landValue, buildingValue, totalValue, excemption, notes } = taxinfo

  const { orderNumber, refeenceNumber, searchDate, effectiveDate, propertyAdderess, state, country, parcelNumber,
    subDivision, lotUnit, block, sfrPudCondo } = user




  const onInputChange2 = (e) => {

    setTaxInfo({ ...taxinfo, [e.target.name]: e.target.value })


  };

  const onInputChange = (e) => {

    setUser({ ...user, [e.target.name]: e.target.value })


  };

  const getTableName = (index) => {
    if (index === 1) return 'VESTING INFORMATION';
    else return `CHAIN OF TITLE ${index - 1}`;
  };



  const [tablesData, setTablesData] = useState([{ id: 1, indicator: 0, data: {}, name: 'VESTING INFORMATION' }]);
  const [nextTableId, setNextTableId] = useState(2);

  const [tablesData2, setTablesData2] = useState([{ id: 1, indicator: 0, data: {} }]);
  const [nextTableId2, setNextTableId2] = useState(2);

  const [tableRowsData, setTableRowsData] = useState([
    { id: 1, data: {} },
    { id: 2, data: {} },
    { id: 3, data: {} }
  ]);
  const [nextRowsId, setNextRowsId] = useState(4);

  const [nameRunData, setNameRunData] = useState([
    { id: 1, data: {} },
    { id: 2, data: {} },
  ]);
  const [nextNameRunId, setNextNameRunId] = useState(4);



  const [tableTaxInstaData, setTableTaxInstaData] = useState([
    { id: 1, data: {} },
    { id: 2, data: {} },
  ]);
  const [nextTableTaxInstaId, setNextTableTaxInstaId] = useState(2);

  const [considerationAmount, setConsiderationAmount] = useState('');


  const handleInputChange = (e, tableId) => {
    const { name, value } = e.target;
    const updatedTablesData = tablesData.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          data: {
            ...table.data,
            [name]: value
          }
        };
      }
      return table;
    });
    setTablesData(updatedTablesData);
  };

  const [amount, setAmount] = useState('');
  const handleInputChange2 = (e, tableId) => {
    const { name, value } = e.target;
    const updatedTablesData2 = tablesData2.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          data: {
            ...table.data,
            [name]: value
          }
        };
      }
      return table;
    });
    setTablesData2(updatedTablesData2);
  };


  const handleChange = (e, rowId) => {
    const { name, value } = e.target;
    const updatedTableRowsData = tableRowsData.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          data: {
            ...row.data,
            [name]: value
          }
        };
      }
      return row;
    });
    setTableRowsData(updatedTableRowsData);
  };


  const handleChangeNameRun = (e, rowId) => {
    const { name, value } = e.target;
    const updatedNameRunData = nameRunData.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          data: {
            ...row.data,
            [name]: value
          }
        };
      }
      return row;
    });
    setNameRunData(updatedNameRunData);
  };

  const handleInputChangeTaxInsta = (e, rowId) => {
    const { name, value } = e.target;
    const updatedTableTaxInstaData = tableTaxInstaData.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          data: {
            ...row.data,
            [name]: value
          }
        };
      }
      return row;
    });
    setTableTaxInstaData(updatedTableTaxInstaData);
  };





  const handleAddTable = (e) => {
    e.preventDefault();
    const newTableId = nextTableId;
    const newName = getTableName(newTableId); // const newTableId = tablesData.length + 1;

    const newIndicator = tablesData.length;
    setTablesData([...tablesData, { id: newTableId, indicator: newIndicator, data: {}, name: newName }]);
    setNextTableId(newTableId + 1);
  };

  const handleDeleteTable = (tableId) => {
    const updatedTables = tablesData.filter(table => table.id !== tableId);
    setTablesData(updatedTables);

    // Remove specific table data from localStorage
    localStorage.removeItem(`vestingTableData_${tableId}`);

    // Update overall tables data in localStorage
    localStorage.setItem('vestingInfo', JSON.stringify(updatedTables));
  };



  const handleAddTable2 = (e) => {
    e.preventDefault();
    const newTableId2 = nextTableId2;   // const newTableId = tablesData.length + 1;       
    const newIndicator = tablesData2.length;
    setTablesData2([...tablesData2, { id: newTableId2, indicator: newIndicator, data: {} }]);
    setNextTableId2(newTableId2 + 1);
  };

  const handleDeleteTable2 = (tableId) => {
    // Filter out the table to delete
    const updatedTables2 = tablesData2.filter(table => table.id !== tableId);
    setTablesData2(updatedTables2);

    // Remove specific mortgage table data from localStorage
    localStorage.removeItem(`mortgageTableData_${tableId}`);

    // Update overall mortgage tables data in localStorage
    localStorage.setItem('mortgageInfo', JSON.stringify(updatedTables2));
  };


  const handleAddRow = (e) => {
    e.preventDefault()
    const newRowsId = nextRowsId;
    const newRow = { id: newRowsId, data: {} };
    setTableRowsData([...tableRowsData, newRow]);
    setNextRowsId(newRowsId + 1);
  };

  const handleDeleteLastRow = () => {
    if (tableRowsData.length > 0) {
      const updatedRows = tableRowsData.slice(0, -1); // Remove the last row
      setTableRowsData(updatedRows);
      localStorage.setItem('tableRowsData', JSON.stringify(updatedRows)); // Update local storage
    }
  };

  const handleDeleteRow = (rowId) => {
    const updatedRows = tableRowsData.filter(row => row.id !== rowId);
    setTableRowsData(updatedRows);
    localStorage.setItem('tableRowsData', JSON.stringify(updatedRows)); // Update local storage
  };

  const handleAddNameRow = (e) => {
    e.preventDefault()
    const newNameRunId = nextNameRunId;
    const newRow = { id: newNameRunId, data: {} };
    setNameRunData([...nameRunData, newRow]);
    setNextNameRunId(newNameRunId + 1);
  };

  const handleDeleteLastNameRow = () => {
    if (nameRunData.length > 0) {
      const updatedRows = nameRunData.slice(0, -1); // Remove the last row
      setNameRunData(updatedRows);
      localStorage.setItem('nameRunData', JSON.stringify(updatedRows)); // Update local storage)
    }
  };

  const handleAddTaxInstaRow = (e) => {
    e.preventDefault()
    const newTableTaxInstaId = nextTableTaxInstaId;
    const newRow = { id: newTableTaxInstaId, data: {} };
    setTableTaxInstaData([...tableTaxInstaData, newRow]);
    setNextTableTaxInstaId(newTableTaxInstaId + 1);
  };

  const handleDeleteLastTaxInstaRow = () => {
    if (tableTaxInstaData.length > 0) {
      const updatedRows = tableTaxInstaData.slice(0, -1); // Remove the last row
      setTableTaxInstaData(updatedRows);
    }
  };

  //  loadin the table data form the Loacl Storage if Saved
  useEffect(() => {
    const savedGeneralInfo = localStorage.getItem('generalInfo');
    if (savedGeneralInfo) {
      setUser(JSON.parse(savedGeneralInfo));
    }

    const savedVestingInfo = localStorage.getItem('vestingInfo');
    if (savedVestingInfo) {
      const parsedData = JSON.parse(savedVestingInfo);

      //     Iterate through parsedData and set each table's data
      const updatedTables = parsedData.map(data => ({
        id: data.id,
        name: data.name,
        data: {
          deedType: data.data.deedType || '',
          considerationAmount: data.data.considerationAmount || '',
          grantor: data.data.grantor || '',
          grantee: data.data.grantee || '',
          vesting: data.data.vesting || '',
          instrBookPage: data.data.instrBookPage || '',
          datedDate: data.data.datedDate || '',
          recordDate: data.data.recordDate || '',
          note: data.data.note || ''
        }
      }));

      // Set the updated tables data and nextTableId
      setTablesData(updatedTables);
      setNextTableId(parsedData.length + 1); // Ensure nextTableId is set correctly
    }

    const savedMortgageInfo = localStorage.getItem('mortgageInfo');
    if (savedMortgageInfo) {
      const parsedData2 = JSON.parse(savedMortgageInfo);

      const updatedTables2 = parsedData2.map(data => ({
        id: data.id,
        data: {
          mortgago: data.data.mortgago || '',
          mortgagee: data.data.mortgagee || '',
          trustee: data.data.trustee || '',
          instBookPage: data.data.instBookPage || '',
          amount: data.data.amount || '',
          datedDate: data.data.datedDate || '',
          recordedDate: data.data.recordedDate || '',
          maturityDate: data.data.maturityDate || '',
          mortageAssiTo: data.data.mortageAssiTo || '',
          assiBkPg: data.data.assiBkPg || '',
          assiDated: data.data.assiDated || '',
          assiRecorded: data.data.assiRecorded || '',
          additionalInformation: data.data.additionalInformation || ''
        }
      }));

      setTablesData2(updatedTables2);
      setNextTableId2(parsedData2.length + 1);
    }


    const savedData = localStorage.getItem('tableRowsData');
    if (savedData) {
      setTableRowsData(JSON.parse(savedData));
      setNextRowsId(JSON.parse(savedData).length + 1);
    }

    const savedData2 = localStorage.getItem('nameRunData');
    if (savedData2) {
      setNameRunData(JSON.parse(savedData2));
    } else {
      // Initialize with default rows if no data is saved
      setNameRunData([
        { id: 1, data: { name: '' } },
        { id: 2, data: { name: '' } }
      ]);
    }

    const savedData3 = JSON.parse(localStorage.getItem('taxInformation'));
    if (savedData3) {
      setTaxInfo({
        landValue: savedData3.landValue || "",
        buildingValue: savedData3.buildingValue || "",
        totalValue: savedData3.totalValue || "",
        excemption: savedData3.excemption || "",
        notes: savedData3.notes || "",
      });
      setTableTaxInstaData(savedData3.tableTaxInstaData || []);
    }


    const savedTaxInfo = localStorage.getItem('taxInformation');
    const savedTableData = localStorage.getItem('tableTaxInstaData');
    if (savedTaxInfo) {
      setTaxInfo(JSON.parse(savedTaxInfo));
    }
    if (savedTableData) {
      setTableTaxInstaData(JSON.parse(savedTableData));
    }
  }, []);


  //  SaveFunction for ETGeneralInfo
  const saveGeneralInfo = () => {
    localStorage.setItem('generalInfo', JSON.stringify(user));
    window.alert("General Info Saved Successfully");
  };

  //  Clear Function for ETGeneralInfo
  const clearGeneralInfo = () => {
    setUser({
      orderNumber: "",
      refeenceNumber: "",
      searchDate: "",
      effectiveDate: "",
      propertyAdderess: "",
      state: "",
      country: "",
      parcelNumber: "",
      subDivision: "",
      lotUnit: "",
      block: "",
      sfrPudCondo: "",
    });
    localStorage.removeItem('generalInfo');
    window.alert("General Info Cleared");
  };

  const saveVestingInfo = (tableId) => {
    const tableData = tablesData.find(table => table.id === tableId);
    localStorage.setItem(`vestingTableData_${tableId}`, JSON.stringify(tableData));
    window.alert('Table Data Saved Successfully');

    // Update overall tables data in localStorage
    localStorage.setItem('vestingInfo', JSON.stringify(tablesData));
  };

  const clearVestingInfo = (tableId) => {
    const updatedTables = tablesData.map(table => {
      if (table.id === tableId) {
        return { ...table, data: {} };
      }
      return table;
    });
    setTablesData(updatedTables);
    localStorage.removeItem(`vestingTableData_${tableId}`);
    window.alert('Table Data Cleared');

    // Update overall tables data in localStorage
    localStorage.setItem('vestingInfo', JSON.stringify(updatedTables));
  };

  const saveMortgageInfo = (tableId) => {
    const tableData = tablesData2.find(table => table.id === tableId);
    localStorage.setItem(`mortgageTableData_${tableId}`, JSON.stringify(tableData));
    window.alert('Table Data Saved Successfully');

    localStorage.setItem('mortgageInfo', JSON.stringify(tablesData2));
  };


  const clearMortgageInfo = (tableId) => {
    const updatedTables = tablesData2.map(table => {
      if (table.id === tableId) {
        return { ...table, data: {} };
      }
      return table;
    });
    setTablesData2(updatedTables);
    localStorage.removeItem(`mortgageTableData_${tableId}`);
    window.alert('Table Data Cleared');

    localStorage.setItem('mortgageInfo', JSON.stringify(updatedTables));
  };

  const handleSave = () => {
    localStorage.setItem('tableRowsData', JSON.stringify(tableRowsData));
    alert('Data saved successfully!');
  };

  // Handle clearing data of the last row
  const handleClear = () => {
    const clearedRows = tableRowsData.map(row => ({ ...row, data: {} }));
    setTableRowsData(clearedRows);
    localStorage.removeItem('tableRowsData'); // Clear local storage
  };


  const handleSaveTemporarilyRow = () => {
    localStorage.setItem('nameRunData', JSON.stringify(nameRunData));
    alert('Data saved successfully!');
  };


  const handleClearRows = () => {
    // Clear data in local storage
    localStorage.removeItem('nameRunsData');

    // Notify user
    window.alert('Table Data Cleared from Local Storage');

    const clearedData = nameRunData.map(row => ({ ...row, data: {} }));
    setNameRunData(clearedData);
    localStorage.removeItem('nameRunData');

  };

  const handleSaveTemporarilyRow1 = () => {
    localStorage.setItem('taxInformation', JSON.stringify(taxinfo));
    localStorage.setItem('tableTaxInstaData', JSON.stringify(tableTaxInstaData));
    alert('Data saved to local storage!');
  };

  const handleClearRows1 = () => {
    setTaxInfo({
      landValue: "",
      buildingValue: "",
      totalValue: "",
      excemption: "",
      notes: "",
    });
    setTableTaxInstaData([]);
    localStorage.removeItem('taxInformation');
    localStorage.removeItem('tableTaxInstaData');
    alert('Data cleared!');
  };


  return (
    <div>
      <Navbar />

      <div className='et-services-container'>
        <center>
          <form className="et-services-form-container" onSubmit={(e) => onSubmit(e)}>
            <table className='et-services-main-table-border'
            //style={{ border: '2px solid black', }}
            >


              <h1><b>ETrack Title Services Inc</b></h1>

              {/* --------------------------------------------------------------Table 1-----------------------------------------------*/}
              <div>
                <br />
                <center>
                  <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-selftables-heading' colSpan="7"> GENERAL INFORMATION </th>
                    </tr>

                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>ORDER NUMBER</th>
                      <td className='et-service-form-table-1-data' colSpan={4} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder="Enter order Number" name="orderNumber" value={orderNumber} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} required />

                      </td>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> ET REFERENCE NUMBER </th>
                      <td className='et-service-form-table-1-data' colSpan={'100%'} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder='Enter Reference Number' name='refeenceNumber' value={refeenceNumber} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>

                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>SEARCH DATE</th>
                      <td className='et-service-form-table-1-data' colSpan={'2'} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="Date" placeholder="Enter Serch Data" name="searchDate" value={searchDate} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>

                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>AS OF</th>
                      <td className='et-service-form-table-1-data' >7:30 Am</td>

                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> EFFECTIVE DATE </th>
                      <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="Date" placeholder="Enter Effective Data " name="effectiveDate" value={effectiveDate} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>

                    <tr className='et-service-form-table-1-rows'>

                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> PROPERTY ADDRESS</th>
                      <td className='et-service-form-table-1-data' colSpan={6} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder="Enter Address " name="propertyAdderess" value={propertyAdderess} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>

                    </tr>

                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> STATE </th>
                      <td colSpan={'4'} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" name="state" placeholder='Enter State' value={state} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>

                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> COUNTRY</th>
                      <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder="Enter Country" name="country" value={country} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>

                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> PARCEL NUMBER</th>
                      <td className='et-service-form-table-1-data' colSpan={'4'} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder='Enter Parcel Number' name="parcelNumber" value={parcelNumber} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>

                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> SUB DIVISION</th>
                      <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder="Enter Sub Division" name="subDivision" value={subDivision} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>

                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> LOT/UNIT  </th>
                      <td className='et-service-form-table-1-data' colSpan={'4'} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder='Enter Unit' name="lotUnit" value={lotUnit} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>BLOCK</th>
                      <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder="Enter Block" name="block" value={block} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>

                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> SFR/PUD/CONDO</th>
                      <td className='et-service-form-table-1-data' colSpan={'6'} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder='Enter SFR/PUD/CONDO' name="sfrPudCondo" value={sfrPudCondo} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>
                  </table>
                </center>

                <Button className='et-service-genenal-info-save-button' label="Save&nbsp;" icon="pi pi-check" type='button' onClick={saveGeneralInfo} />
                <Button className='et-service-genenal-info-clear-button' label="Clear&nbsp;" icon="pi pi-times" type='button' onClick={clearGeneralInfo} />
              </div>

              {/* --------------------------------------------------------------Table 2-----------------------------------------------*/}

              <div>
                {tablesData.map(table => (
                  <div key={table.id}>


                    <br />
                    <center>
                      <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                        <tr className='et-service-form-table-1-rows' >
                          <th className='et-service-form-table-selftables-heading' colSpan="7"> {table.name} </th>
                        </tr>
                        <tr className='et-service-form-table-1-rows'>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> DEED TYPE  </th>
                          <td className='et-service-form-table-1-data' colSpan={4} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="Enter  Deed Type" name="deedType" style={{ width: '100%' }} value={table.data.deedType || ''} onChange={(e) => handleInputChange(e, table.id)} required />
                          </td>
                          <th style={{ border: '1px solid black' }}> CONSIDERATION AMOUNT: </th>
                          <td colSpan={'100%'} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="Enter Consideration Amount" name="considerationAmount" style={{ width: '100%' }} value={table.data.considerationAmount || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>
                        </tr>

                        <tr className='et-service-form-table-1-rows'>
                          <th style={{ border: '1px solid black' }}> GRANTOR </th>
                          <td className='et-service-form-table-1-data' colSpan={'6'} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="Enter Grantor" name="grantor" style={{ width: '100%' }} value={table.data.grantor || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>
                        </tr>
                        <tr className='et-service-form-table-1-rows' >
                          <th style={{ border: '1px solid black' }}> GRANTEE </th>
                          <td className='et-service-form-table-1-data' colSpan={6} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="Enter Grantee" name="grantee" style={{ width: '100%' }} value={table.data.grantee || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>
                        </tr>

                        <tr className='et-service-form-table-1-rows' >
                          <th style={{ border: '1px solid black' }}> VESTING </th>
                          <td className='et-service-form-table-1-data' colSpan={'4'} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="Enter Vesting" name="vesting" style={{ width: '100%' }} value={table.data.vesting || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>

                          <th style={{ border: '1px solid black' }}>INSTR/BOOK/PAGE:</th>
                          <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="Enter INSTR/BOOK/PAGE" name="instrBookPage" style={{ width: '100%' }} value={table.data.instrBookPage || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>
                        </tr>

                        <tr className='et-service-form-table-1-rows' >
                          <th style={{ border: '1px solid black' }}> DATED DATE: </th>
                          <td className='et-service-form-table-1-data' colSpan={'4'} style={{ border: '1px solid black' }}>
                            <input type="Date" className="et-service-input-labels" placeholder="Enter Date" name="datedDate" style={{ width: '100%' }} value={table.data.datedDate || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>

                          <th style={{ border: '1px solid black' }}>RECORDED DATE:</th>
                          <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                            <input type="Date" className="et-service-input-labels" placeholder="Enter RECORDED DATE" name="recordDate" style={{ width: '100%' }} value={table.data.recordDate || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>
                        </tr>

                        <tr className='et-service-form-table-1-rows'>
                          <th style={{ border: '1px solid black' }}>NOTES</th>
                          <td className='et-service-form-table-1-data' colSpan={6} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="Enter Notes" name="note" style={{ width: '100%' }} value={table.data.note || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>

                        </tr>
                      </table>
                    </center>


                    {table.id > 1 && (
                      <button className="et-services-delete-button" onClick={() => handleDeleteTable(table.id)}>
                        <i className="pi pi-trash"     ></i> Table</button>
                    )}
                    <button className="et-services-add-button" onClick={handleAddTable}> <i className="pi pi-plus"     ></i>Table</button>

                    <Button className='et-service-genenal-info-save-button' label="Save&nbsp;" icon="pi pi-check" type='button' onClick={() => saveVestingInfo(table.id)} />
                    <Button className='et-service-genenal-info-clear-button' label="Clear&nbsp;" icon="pi pi-times" type='button' onClick={() => clearVestingInfo(table.id)} />
                  </div>
                ))}
                <br />
              </div>
              <br />

              {/* --------------------------------------------------------------Table 3-----------------------------------------------*/}
              <div>
                {tablesData2.map(table => (
                  <div key={table.id}>
                    <br />
                    <center>
                      <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                        <tr>
                          <th className='et-service-form-table-selftables-heading' colSpan="7">OPEN MORTGAGE / DEED OF TRUST  - ({table.id}) INFORMATION </th>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> MORTGAGO </th>
                          <td className='et-service-form-table-1-data' colSpan={6} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="Enter  MORTGAGO" name="mortgago" style={{ width: '100%' }} value={table.data.mortgago || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> MORTGAGEE </th>
                          <td className='et-service-form-table-1-data' colSpan={'6'} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder='Enter MORTGAGEE' name="mortgagee" style={{ width: '100%' }} value={table.data.mortgagee || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> TRUSTEE </th>
                          <td className='et-service-form-table-1-data' colSpan={6} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="Enter TRUSTEE" name="trustee" style={{ width: '100%' }} value={table.data.trustee || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> INSTRUMENT/BOOK/PAGE: </th>
                          <td className='et-service-form-table-1-data' colSpan={'4'} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="Enter INSTRUMENT/BOOK/PAGE:" name="instBookPage" style={{ width: '100%' }} value={table.data.instBookPage || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>AMOUNT[$]:</th>
                          <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="$ Enter Amount" name="amount" style={{ width: '100%' }} value={table.data.amount || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> DATED DATE: </th>
                          <td className='et-service-form-table-1-data' colSpan={'4'} style={{ border: '1px solid black' }}>
                            <input type="date" className="et-service-input-labels" name="datedDate" placeholder='Enter DATED DATE:' style={{ width: '100%' }} value={table.data.datedDate || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>RECORDED DATE:</th>
                          <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                            <input type="date" className="et-service-input-labels" placeholder="Enter RECORDED DATE" name="recordedDate" style={{ width: '100%' }} value={table.data.recordedDate || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <td colSpan={5}></td>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> MATURITY DATE </th>
                          <td className='et-service-form-table-1-data' colSpan={3} style={{ border: '1px solid black' }}>
                            <input type="date" className="et-service-input-labels" placeholder="Enter Maturity Date" name="maturityDate" style={{ width: '100%' }} value={table.data.maturityDate || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> MORTGAGE ASSIGNED TO </th>
                          <td className='et-service-form-table-1-data' colSpan={'4'} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" name="mortageAssiTo" placeholder='Enter MORTGAGE ASSIGNED TO' style={{ width: '100%' }} value={table.data.mortageAssiTo || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>ASSIGNMENT BK/PG </th>
                          <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                            <input type="number" className="et-service-input-labels" placeholder="Enter ASSIGNMENT BK/PG" name="assiBkPg" style={{ width: '100%' }} value={table.data.assiBkPg || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> ASSIGNMENT DATED </th>
                          <td className='et-service-form-table-1-data' colSpan={'4'} style={{ border: '1px solid black' }}>
                            <input type="date" className="et-service-input-labels" name="assiDated" placeholder='Enter ASSIGNMENT DATED' style={{ width: '100%' }} value={table.data.assiDated || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>ASSIGNMENT RECORDED: </th>
                          <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="Enter ASSIGNMENT RECORDED:" name="assiRecorded" style={{ width: '100%' }} value={table.data.assiRecorded || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> ADDITIONAL INFORMATION</th>
                          <td className='et-service-form-table-1-data' colSpan={6} style={{ border: '1px solid black' }}>
                            <input type='text' className="et-service-input-labels" placeholder="Enter Additional Infromation" name="additionalInformation" style={{ width: '100%' }} value={table.data.additionalInformation || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>
                      </table>
                    </center>

                    {table.id > 1 && (
                      <button className="et-services-delete-button" onClick={() => handleDeleteTable2(table.id)}>
                        <i className="pi pi-trash"     ></i> Table
                      </button>
                    )}
                    <button className="et-services-add-button" onClick={handleAddTable2}>
                      <i className="pi pi-plus"     ></i>Table
                    </button>
                    <Button className='et-service-genenal-info-save-button' label="Save&nbsp;" icon="pi pi-check" type='button' onClick={() => saveMortgageInfo(table.id)} />
                    <Button className='et-service-genenal-info-clear-button' label="Clear&nbsp;" icon="pi pi-times" type='button' onClick={() => clearMortgageInfo(table.id)} />
                  </div>
                ))}
                <br />

                {/* --------------------------------------------------------------Table 4-----------------------------------------------*/}
                <div>
                  <br />
                  <center>
                    <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                      {/* Table headers */}
                      <thead>
                        <tr className='th-color'>
                          <th className='et-service-form-table-selftables-heading' colSpan={4}>ACTIVE JUDGMENTS AND LIENS</th>
                        </tr>
                        <tr className='th-color'>
                          <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>CASE NUMBER</th>
                          <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>DESCRIPTION</th>
                          <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>DATE RECORDED</th>
                          <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>AMOUNT</th>
                        </tr>
                      </thead>
                      {/* Table body */}
                      <tbody>
                        {tableRowsData.map((row) => (
                          <tr key={row.id}>
                            <td className='et-service-form-table-1-data' style={{ border: '1px solid black' }}>
                              <input type="text" className="et-service-input-labels" placeholder="Enter Case Number" name="caseNumber" value={row.data.caseNumber || ''} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                            </td>
                            <td className='et-service-form-table-1-data' style={{ border: '1px solid black' }}>
                              <input type="text" className="et-service-input-labels" placeholder="Enter Description" name="description" value={row.data.description || ''} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                            </td>
                            <td className='et-service-form-table-1-data' style={{ border: '1px solid black' }}>
                              <input type="date" className="et-service-input-labels" placeholder="Enter Date" name="dateRecorded" value={row.data.dateRecorded || ''} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                            </td>
                            <td className='et-service-form-table-1-data' style={{ border: '1px solid black' }}>
                              <input type="text" className="et-service-input-labels" placeholder="Enter Amount" name="amount" value={row.data.amount || ''} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </center>
                  <button className="et-services-add-button" type='button' onClick={handleAddRow}> <i className="pi pi-plus"     ></i>Row</button>
                  {tableRowsData.length > 3 && (
                    <button className="et-services-delete-button" onClick={handleDeleteLastRow}>
                      <i className="pi pi-trash"     ></i> Row
                    </button>
                  )}
                  <br />
                  <Button className='et-service-genenal-info-save-button' label="Save&nbsp;" icon="pi pi-check" type='button' onClick={handleSave} />
                  <Button className='et-service-genenal-info-clear-button' label="Clear&nbsp;" icon="pi pi-times" type='button' onClick={handleClear} />
                </div>


                {/* --------------------------------------------------------------Table 5-----------------------------------------------*/}

                <div>
                  <br />
                  <center>
                    <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >
                      <tr>
                        <th className='et-service-form-table-selftables-heading' colSpan="4">TAX INFORMATION </th>
                      </tr>
                      <tr className='th-color'>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>ASSESMENT YEAR</th>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>2023</th>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>TAX YEAR</th>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>2023</th>
                      </tr>

                      <tr>
                        <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }} > LAND VALUE </td>
                        <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }} >
                          <input type="text" className="et-service-input-labels" placeholder="Enter LandValue" name="landValue" value={taxinfo.landValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                        </td>
                        <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }} > BUILDING VALUE </td>
                        <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }} >
                          <input type="text" className="et-service-input-labels" placeholder="Enter BuildingValue" name="buildingValue" value={taxinfo.buildingValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                        </td>
                      </tr>

                      <tr>
                        <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }} > TOTAL VALUE </td>
                        <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }} >
                          <input type="text" className="et-service-input-labels" placeholder="Enter TotalValue" name="totalValue" value={taxinfo.totalValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                        </td>
                        <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }} > EXEMPTION </td>
                        <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }} >
                          <input type="text" className="et-service-input-labels" placeholder="Enter Excemption" name="excemption" value={taxinfo.excemption} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                        </td>
                      </tr>

                      <tr>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>INSTALLMENT</th>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>AMOUNT</th>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>STATUS</th>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>PAID/DUE DATE</th>

                      </tr>

                      {
                        tableTaxInstaData.map((row) => (
                          <tr key={row.id}>
                            <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }} >{row.id - 1 === 0 ? `${row.id}ST INSTALLMENT ` : row.id - 1 === 1 ? ` ${row.id}ND INSTALLMENT` : row.id - 1 === 2 ? `${row.id}rd Installment` : `${row.id}th Installemnt`}</td>
                            <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }} >
                              <input type="text" className="et-service-input-labels" name="amount" placeholder='Enter Amount' onChange={e => handleInputChangeTaxInsta(e, row.id)} style={{ width: '100%' }} />
                            </td>
                            <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }} >
                              <input type="text" className="et-service-input-labels" name="status" placeholder='Enter Status' onChange={e => handleInputChangeTaxInsta(e, row.id)} style={{ width: '100%' }} />                                </td>
                            <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }} >
                              <input type="Date" className="et-service-input-labels" name="paidDueDate" placeholder='Enter Date' onChange={e => handleInputChangeTaxInsta(e, row.id)} style={{ width: '100%' }} />
                            </td>
                          </tr>
                        ))
                      }
                      <tr>
                        <th style={{ border: '1px solid black' }}> NOTES </th>
                        <td className='et-service-form-table-1-data' colSpan={6} style={{ border: '1px solid black' }}>
                          <input type='text-area' className="et-service-input-labels" placeholder="Enter Notes" name="notes" value={notes} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                        </td>
                      </tr>
                    </table>
                    <button className="et-services-add-button" onClick={handleAddTaxInstaRow}> <i className="pi pi-plus"     ></i> Row</button>
                    {tableTaxInstaData.length > 2 && (
                      <button className="et-services-delete-button" onClick={handleDeleteLastTaxInstaRow}>
                        <i className="pi pi-trash"     ></i> Row  </button>
                    )}
                  </center>
                </div>

                <Button className='et-service-genenal-info-save-button' label="Save&nbsp;" icon="pi pi-check" type='button' onClick={handleSaveTemporarilyRow1} />
                <Button className='et-service-genenal-info-clear-button' label="Clear&nbsp;" icon="pi pi-times" type='button' onClick={handleClearRows1} />
              </div>
              <br />
              <br />

              {/* --------------------------------------------------------------Table 6-----------------------------------------------*/}
              <div>
                <br />
                <center>
                  <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                    <tr >
                      <th className='et-service-form-table-selftables-heading' colSpan={5}> NAMES RUNS </th>
                    </tr>
                    <tr className='th-color'>
                      <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black', width: '25%' }}> NAMES</th>
                      <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>  JUD </th>
                      <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}> LIENS </th>
                      <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>UCC</th>
                      <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>Others</th>
                    </tr>
                    {nameRunData.map((row) => (
                      <tr>
                        <td style={{ border: '1px solid black' }}>
                          <input type="text" className="et-service-input-labels" name="name" placeholder='Enter Name' onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} />

                        </td>
                        <td style={{ border: '1px solid black' }}>
                          <input type="text" className="et-service-input-labels" name="jud" placeholder='Enter JUD' onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} />
                        </td>
                        <td style={{ border: '1px solid black' }}>
                          <input type="text" className="et-service-input-labels" name="liens" placeholder='Enter LIENS' onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} /></td>
                        <td style={{ border: '1px solid black' }}>
                          <input type="text" className="et-service-input-labels" name="ucc" placeholder='Enter UCC' onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} /></td>
                        <td style={{ border: '1px solid black' }}>
                          <input type="text" className="et-service-input-labels" name="others" placeholder='Enter ' onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} /></td>
                      </tr>
                    ))}
                  </table>
                  <button className="et-services-add-button" type='button' onClick={handleAddNameRow}> <i className="pi pi-plus"     ></i> Row</button>
                  {nameRunData.length > 2 && (
                    <button className="et-services-delete-button" type='button' onClick={handleDeleteLastNameRow}>
                      <i className="pi pi-trash"     ></i> Row </button>
                  )}
                </center>
              </div>
              <div>

                <Button className='et-service-genenal-info-save-button' label="Save&nbsp;" icon="pi pi-check" type='button' onClick={handleSaveTemporarilyRow1} />
                <Button className='et-service-genenal-info-clear-button' label="Clear&nbsp;" icon="pi pi-times" type='button' onClick={handleClearRows} />
              </div>
              {/* --------------------------------------------------------------Table 7-----------------------------------------------*/}
              <div>
                <br />
                <center>
                  <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >
                    <tr>
                      <th className='et-service-form-table-selftables-heading' colSpan="5">LEGAL DESCRIPTION </th>
                    </tr>
                    <tr>
                      <td className='et-service-form-table-1-data' style={{ border: '1px solid black' }}>
                        <p> FOR COMPLETE LEGAL DESCRIPTION SEE ATTACHED VESTING DEED ASSESSOR'S
                          <br />
                          <br />
                          <br />
                          PARCEL NUMBER:</p>
                      </td>
                    </tr>

                  </table>
                  <br />
                </center>
              </div>

              {/* --------------------------------------------------------------Table 8-----------------------------------------------*/}
              <div>
                <br />
                <center>
                  <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >

                    <tr>
                      <th className='et-service-form-table-selftables-heading' colSpan="5">DISCLAIMER</th>
                    </tr>

                    <tr>
                      <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }}>This title search report was performed in accordance with generally accepted standards. This report may not contain information affecting above real estate property that cannot be indexed due to different spelling of owner's name or incorrectly recorded parcel number or recorder clerk error. This title search does not include a search of the records of the circuit, probate, bankruptcy or other courts nor any recorders other than the records in the office of the Register of Deeds. Taxes are informational purposes only, all information contained herein are obtained from Tax Collectors office/website. Please do check for any additional levies and assessments before settlement. E-Track Title Services, Inc. makes no warranties, and assumes no liability whatsoever for the accuracy of the information contained herein beyond the exercise of such reasonable care.</td>
                    </tr>

                  </table>
                </center>
                <br />


              </div>
              {/* --------------------------------------------------------------Table 9-----------------------------------------------*/}
              <div>
                <br />
                <center>
                  <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >
                  </table>
                </center>
              </div>
              <button className="et-service-form-submit-button" type="submit">
                <i className="pi pi-check"     ></i>Submit
              </button>

            </table>
          </form>
        </center>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  )
}

export default EtServices
