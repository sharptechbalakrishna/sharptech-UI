import React from 'react'
import { ProgressSpinner } from 'primereact/progressspinner';
import 'primereact/resources/themes/saga-blue/theme.css';  // Or any other theme you prefer
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import "./EtServices.css"
import { Button } from 'primereact/button';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import UserService from '../../../implements/UserService/UserService';
import { useNavigate } from 'react-router-dom';

function EtServices() {

  const navigate = useNavigate();

  const [additionalInformation, setAdditionalInformation] = useState('');

  const [assementYear, setassementYear] = useState('');
  const [taxYear, setTaxYear] = useState('');



  const handleAssessmentYearChange = (e) => {
    setassementYear(e.target.value);
  };

  const handleTaxYearChange = (e) => {
    setTaxYear(e.target.value);
  };

  // Generate a list of years from 1900 to current year
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let year = 1900; year <= currentYear; year++) {
    years.push(year.toString());
  }

  // Handle input changes
  const onInputChangeinfo = (event) => {
    setAdditionalInformation(event.target.value);
  };

  // UseEffect to log changes in additionalInformation
  useEffect(() => {
    console.log("Additional Information updated:", additionalInformation);
  }, [additionalInformation]);


  const [legaldescription, setlegaldescription] = useState('');

  // Handle input changes
  const onInputlegalinfo = (event) => {
    setlegaldescription(event.target.value);
  };

  // UseEffect to log changes in additionalInformation
  useEffect(() => {
    console.log("Additional Information updated:", legaldescription);
  }, [legaldescription]);






  const handleInfoChange = (event) => {
    setAdditionalInformation(event.target.value);
  };


  const [loading, setLoading] = useState(false);


  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
              assementYear: assementYear,
              taxYear: taxYear,
              landValue: landValue,
              buildingValue: buildingValue,
              totalValue: buildingValue,
              excemption: excemption,
              notes: notes
            }
          ],

          etadditionalinformation:
            [{
              additionalInformation: additionalInformation
            }],

          etlegaldescriptioninfo: [{
            legaldescription: legaldescription
          }],

          etnameruns: nameRunData.map(row => ({ ...row.data })),
          ettaxinstallment: tableTaxInstaData.map(row => ({
            installment: row.installment,
            amount: row.amount || '',
            status: row.status || '',
            paidDueDate: row.paidDueDate || ''
          })),
        }
      };
      console.log('sending data', payload);
      const response = await axios.post(`${UserService.BASE_URL}/etinsert`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('receiving data', response);
      if (response.data && response.data.statusCode === 200) {
        window.alert(response.data.message || "Et Report Submitted Successfully");
      } else {
        window.alert(response.data.message || " Something went wrong in Et Report");
      }
      navigate(`/EtServiceDisplay/${orderNumber}`);
    } catch (error) {
      console.error("Registration failed:", error);
      window.alert("Data Not Sent Somthing went Wrong"); // Handle error if registration fails
    } finally {
      setLoading(false);
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
    assementYear: "",
    taxYear: "",
    buildingValue: "",
    totalValue: "",
    excemption: "",
    notes: "",
  })

  const { landValue, buildingValue, totalValue, excemption, notes } = taxinfo

  const [tableTaxInstaData, setTableTaxInstaData] = useState([
    { id: 1, installment: "1st Installment", amount: "", status: "", paidDueDate: "" },
    { id: 2, installment: "2nd Installment", amount: "", status: "", paidDueDate: "" },
  ]);
  const [nextTableTaxInstaId, setNextTableTaxInstaId] = useState(3);

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
    { id: 1, data: { name: '', jud: '', liens: '', ucc: '', others: '' } },
    { id: 2, data: { name: '', jud: '', liens: '', ucc: '', others: '' } },
  ]);
  const [nextNameRunId, setNextNameRunId] = useState(3);





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
    const updatedData = nameRunData.map(row => {
      if (row.id === rowId) {
        return { ...row, data: { ...row.data, [name]: value } };
      }
      return row;
    });
    setNameRunData(updatedData);
  };

  const handleInputChangeTaxInsta = (e, index) => {
    const { name, value } = e.target;
    const newTableData = [...tableTaxInstaData];
    newTableData[index] = {
      ...newTableData[index],
      [name]: value
    };
    setTableTaxInstaData(newTableData);
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
    localStorage.setItem('etvestingInfo', JSON.stringify(updatedTables));
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
    localStorage.setItem('etmortgageInfo', JSON.stringify(updatedTables2));
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
      localStorage.setItem('etActiveJudgment', JSON.stringify(updatedRows)); // Update local storage
    }
  };

  const handleDeleteRow = (rowId) => {
    const updatedRows = tableRowsData.filter(row => row.id !== rowId);
    setTableRowsData(updatedRows);
    localStorage.setItem('etActiveJudgment', JSON.stringify(updatedRows)); // Update local storage
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
      localStorage.setItem('etnameRunData', JSON.stringify(updatedRows)); // Update local storage)
    }
  };

  const handleAddTaxInstaRow = (e) => {
    e.preventDefault()
    const newTableTaxInstaId = nextTableTaxInstaId;
    const newRow = { id: newTableTaxInstaId, installment: newTableTaxInstaId === 3 ? `${newTableTaxInstaId}rd Installment` : `${newTableTaxInstaId}th Installment`, amount: '', status: '', paidDueDate: '' }; // Initialize fields    setTableTaxInstaData([...tableTaxInstaData, newRow]);
    setTableTaxInstaData([...tableTaxInstaData, newRow]);
    setNextTableTaxInstaId(newTableTaxInstaId + 1);
  }

  const handleDeleteLastTaxInstaRow = () => {
    if (tableTaxInstaData.length > 0) {
      const updatedRows = tableTaxInstaData.slice(0, -1); // Remove the last row
      setTableTaxInstaData(updatedRows);
      setNextTableTaxInstaId(updatedRows.length + 1); // Add 1 because array index starts
      localStorage.setItem('ettableTaxInstaData', JSON.stringify(updatedRows));
    }
  };

  //  loadin the table data form the Loacl Storage if Saved
  useEffect(() => {
    const savedGeneralInfo = localStorage.getItem('etgeneralInfo');
    if (savedGeneralInfo) {
      setUser(JSON.parse(savedGeneralInfo));
    }

    const savedVestingInfo = localStorage.getItem('etvestingInfo');
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

    const savedMortgageInfo = localStorage.getItem('etmortgageInfo');
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


    const savedData = localStorage.getItem('etActiveJudgment');
    if (savedData) {
      setTableRowsData(JSON.parse(savedData));
      setNextRowsId(JSON.parse(savedData).length + 1);
    }

    const namerundata = localStorage.getItem('etnameRunData');
    if (namerundata) {
      const parsedData = JSON.parse(namerundata);
      setNameRunData(parsedData);
      setNextNameRunId(parsedData.length + 1);
    }

    const savedTaxInfo = JSON.parse(localStorage.getItem('ettaxInformation'));
    const savedTableData = JSON.parse(localStorage.getItem('ettableTaxInstaData'));
    if (savedTaxInfo) {
      setTaxInfo(savedTaxInfo);
    }
    if (savedTableData) {
      setTableTaxInstaData(savedTableData);
    }
  }, []);


  //  SaveFunction for ETGeneralInfo
  const saveGeneralInfo = () => {
    localStorage.setItem('etgeneralInfo', JSON.stringify(user));
    window.alert("General Info Saved Locally");
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
    localStorage.removeItem('etgeneralInfo');
    window.alert("General Info Cleared Locally");
  };

  const saveVestingInfo = (tableId) => {
    const tableData = tablesData.find(table => table.id === tableId);
    localStorage.setItem(`vestingTableData_${tableId}`, JSON.stringify(tableData));
    window.alert('Vesting Info Saved Locally');

    // Update overall tables data in localStorage
    localStorage.setItem('etvestingInfo', JSON.stringify(tablesData));
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


    // Update overall tables data in localStorage
    localStorage.setItem('etvestingInfo', JSON.stringify(updatedTables));
    window.alert('Vesting Info Cleared Locally');
  };

  const saveMortgageInfo = (tableId) => {
    const tableData = tablesData2.find(table => table.id === tableId);
    localStorage.setItem(`mortgageTableData_${tableId}`, JSON.stringify(tableData));


    localStorage.setItem('etmortgageInfo', JSON.stringify(tablesData2));
    window.alert('OpenMortage Saved Locally');
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
    window.alert('OpenMortage Cleared Locally');

    localStorage.setItem('etmortgageInfo', JSON.stringify(updatedTables));
  };

  const handleSave = () => {
    localStorage.setItem('etActiveJudgment', JSON.stringify(tableRowsData));
    alert('Active Judgment and lines saved locally');
  };

  // Handle clearing data of the last row
  const handleClear = () => {
    const clearedRows = tableRowsData.map(row => ({ ...row, data: {} }));
    setTableRowsData(clearedRows);
    localStorage.removeItem('etActiveJudgment'); // Clear local storage
    alert('Active Judgment and lines cleared locally');

  };




  const handleSaveTemporarilyRow = () => {
    localStorage.setItem('etnameRunData', JSON.stringify(nameRunData));
    alert('Names Runs saved locally');
  };

  const handleClearRows = () => {
    const clearedData = nameRunData.map(row => ({
      ...row,
      data: { name: '', jud: '', liens: '', ucc: '', others: '' }
    }));
    setNameRunData(clearedData);
    localStorage.removeItem('etnameRunData');
    alert('Names Runs cleared locally');
  };

  const handleSaveTemporarilyRow1 = () => {
    localStorage.setItem('ettaxInformation', JSON.stringify(taxinfo));
    localStorage.setItem('ettableTaxInstaData', JSON.stringify(tableTaxInstaData));
    alert('Tax Info saved locally ');
  };

  const handleClearRows1 = () => {
    const clearedData = tableTaxInstaData.map(row => ({
      ...row,
      amount: '',
      status: '',
      paidDueDate: ''
    }));
    setTableTaxInstaData(clearedData);
    setTaxInfo({
      landValue: "",
      buildingValue: "",
      totalValue: "",
      excemption: "",
      notes: "",
      assementYear: "",
      taxYear: ""
    });
    localStorage.removeItem('ettaxInformation');
    localStorage.removeItem('ettableTaxInstaData');
    alert('Tax Info cleared locally');
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

              {/* --------------------------------------------------------------GENERAL INFORMATION 1-----------------------------------------------*/}
              <div>
                <br />
                <center>
                  <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-selftables-heading' colSpan="7"> GENERAL INFORMATION </th>
                    </tr>

                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>ORDER NUMBERL:</th>
                      <td colSpan={4} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder="ORDER NUMBERL" name="orderNumber" value={orderNumber} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} required />

                      </td>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> ET REFERENCE NUMBER: </th>
                      <td colSpan={'100%'} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder='ET REFERENCE NUMBER' name='refeenceNumber' value={refeenceNumber} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>

                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>SEARCH DATE:</th>
                      <td colSpan={'2'} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="Date" placeholder="SEARCH DATE" name="searchDate" value={searchDate} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>

                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>AS OF</th>
                      <td className='et-service-form-table-1-data' >7:30 Am</td>

                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> EFFECTIVE DATE: </th>
                      <td colSpan={2} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="Date" placeholder="EFFECTIVE DATE " name="effectiveDate" value={effectiveDate} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>

                    <tr className='et-service-form-table-1-rows'>

                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> PROPERTY ADDRESS:</th>
                      <td colSpan={6} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder="PROPERTY ADDRESS" name="propertyAdderess" value={propertyAdderess} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>

                    </tr>

                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> STATE: </th>
                      <td colSpan={'4'} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" name="state" placeholder='STATE' value={state} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>

                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> COUNTRY:</th>
                      <td colSpan={2} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder="COUNTRY" name="country" value={country} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>

                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> PARCEL NUMBER:</th>
                      <td colSpan={'4'} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder='PARCEL NUMBER' name="parcelNumber" value={parcelNumber} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>

                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> SUB DIVISION:</th>
                      <td colSpan={2} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder="SUB DIVISION" name="subDivision" value={subDivision} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>

                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> LOT/UNIT:  </th>
                      <td colSpan={'4'} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder='LOT/UNIT' name="lotUnit" value={lotUnit} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>BLOCK:</th>
                      <td colSpan={2} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder="BLOCK" name="block" value={block} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>

                    <tr className='et-service-form-table-1-rows'>
                      <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> SFR/PUD/CONDO:</th>
                      <td colSpan={'6'} style={{ border: '1px solid black' }}>
                        <input className="et-service-input-labels" type="text" placeholder='SFR/PUD/CONDO' name="sfrPudCondo" value={sfrPudCondo} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>
                  </table>
                </center>

                <Button className='et-service-genenal-info-save-button' label="Save&nbsp;" icon="pi pi-check" type='button' onClick={saveGeneralInfo} />
                <Button className='et-service-genenal-info-clear-button' label="Clear&nbsp;" icon="pi pi-times" type='button' onClick={clearGeneralInfo} />
              </div>

              {/* --------------------------------------------------------------VestingInfo 2-----------------------------------------------*/}

              <div>
                {tablesData.map(table => (
                  <div key={table.id}>


                    <br />
                    <center>
                      <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                        <tr className='et-service-form-table-1-rows' >
                          <th className='et-service-form-table-selftables-heading' colSpan="7"> {table.name ? table.name : 'VESTING INFORMATION'} </th>
                        </tr>
                        <tr className='et-service-form-table-1-rows'>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> DEED TYPE:  </th>
                          <td colSpan={4} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="DEED TYPE" name="deedType" style={{ width: '100%' }} value={table.data.deedType || ''} onChange={(e) => handleInputChange(e, table.id)} required />
                          </td>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> CONSIDERATION AMOUNT: </th>
                          <td colSpan={'100%'} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="CONSIDERATION AMOUNT" name="considerationAmount" style={{ width: '100%' }} value={table.data.considerationAmount || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>
                        </tr>

                        <tr className='et-service-form-table-1-rows'>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> GRANTOR: </th>
                          <td colSpan={'6'} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="GRANTOR" name="grantor" style={{ width: '100%' }} value={table.data.grantor || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>
                        </tr>
                        <tr className='et-service-form-table-1-rows' >
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> GRANTEE: </th>
                          <td colSpan={6} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="GRANTEE" name="grantee" style={{ width: '100%' }} value={table.data.grantee || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>
                        </tr>

                        <tr className='et-service-form-table-1-rows' >
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> VESTING: </th>
                          <td colSpan={'4'} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="VESTING" name="vesting" style={{ width: '100%' }} value={table.data.vesting || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>

                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>INSTR/BOOK/PAGE:</th>
                          <td colSpan={2} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="INSTR/BOOK/PAGE" name="instrBookPage" style={{ width: '100%' }} value={table.data.instrBookPage || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>
                        </tr>

                        <tr className='et-service-form-table-1-rows' >
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> DATED DATE: </th>
                          <td colSpan={'4'} style={{ border: '1px solid black' }}>
                            <input type="Date" className="et-service-input-labels" placeholder="DATED DATE" name="datedDate" style={{ width: '100%' }} value={table.data.datedDate || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>

                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>RECORDED DATE:</th>
                          <td colSpan={2} style={{ border: '1px solid black' }}>
                            <input type="Date" className="et-service-input-labels" placeholder="RECORDED DATE" name="recordDate" style={{ width: '100%' }} value={table.data.recordDate || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>
                        </tr>

                        <tr className='et-service-form-table-1-rows'>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>NOTES:</th>
                          <td colSpan={6} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="NOTES" name="note" style={{ width: '100%' }} value={table.data.note || ''} onChange={(e) => handleInputChange(e, table.id)} />
                          </td>

                        </tr>
                      </table>
                    </center>



                    <button className="et-service-genenal-info-add-button" onClick={handleAddTable}> <i className="pi pi-plus" style={{ marginRight: '5px' }}></i>  Table  </button>
                    {table.id > 1 && (
                      <button className="et-service-genenal-info-delete-button" onClick={() => handleDeleteTable(table.id)}> <i className="pi pi-trash" ></i> Table</button>
                    )}
                    <Button className='et-service-genenal-info-save-button' label="Save&nbsp;" icon="pi pi-check" type='button' onClick={() => saveVestingInfo(table.id)} />
                    <Button className='et-service-genenal-info-clear-button' label="Clear&nbsp;" icon="pi pi-times" type='button' onClick={() => clearVestingInfo(table.id)} />
                  </div>
                ))}
                <br />
              </div>
              <br />

              {/* --------------------------------------------------------------OPEN MORTGAGE 3-----------------------------------------------*/}
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
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> MORTGAGOR: </th>
                          <td colSpan={6} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="MORTGAGOR" name="mortgago" style={{ width: '100%' }} value={table.data.mortgago || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> MORTGAGEE: </th>
                          <td colSpan={'6'} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder='MORTGAGEE' name="mortgagee" style={{ width: '100%' }} value={table.data.mortgagee || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> TRUSTEE: </th>
                          <td colSpan={6} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="TRUSTEE" name="trustee" style={{ width: '100%' }} value={table.data.trustee || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> INSTRUMENT/BOOK/PAGE: </th>
                          <td colSpan={'4'} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="INSTRUMENT/BOOK/PAGE:" name="instBookPage" style={{ width: '100%' }} value={table.data.instBookPage || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>AMOUNT:</th>
                          <td colSpan={2} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="$ AMOUNT" name="amount" style={{ width: '100%' }} value={table.data.amount || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> DATED DATE: </th>
                          <td colSpan={'4'} style={{ border: '1px solid black' }}>
                            <input type="date" className="et-service-input-labels" placeholder="RECORDED DATE" name="datedDate" style={{ width: '100%' }} value={table.data.datedDate || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>RECORDED DATE:</th>
                          <td colSpan={2} style={{ border: '1px solid black' }}>
                            <input type="date" className="et-service-input-labels" placeholder="RECORDED DATE" name="recordedDate" style={{ width: '100%' }} value={table.data.recordedDate || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <td colSpan={5}></td>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> MATURITY DATE: </th>
                          <td colSpan={3} style={{ border: '1px solid black' }}>
                            <input type="date" className="et-service-input-labels" placeholder="MATURITY DATE" name="maturityDate" style={{ width: '100%' }} value={table.data.maturityDate || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> MORTGAGE ASSIGNED TO: </th>
                          <td colSpan={'4'} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" name="mortageAssiTo" placeholder='MORTGAGE ASSIGNED TO' style={{ width: '100%' }} value={table.data.mortageAssiTo || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>ASSIGNMENT BK/PG: </th>
                          <td colSpan={2} style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="ASSIGNMENT BK/PG" name="assiBkPg" style={{ width: '100%' }} value={table.data.assiBkPg || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> ASSIGNMENT DATED: </th>
                          <td colSpan={'4'} style={{ border: '1px solid black' }}>
                            <input type="date" className="et-service-input-labels" name="assiDated" placeholder='ASSIGNMENT DATED' style={{ width: '100%' }} value={table.data.assiDated || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>ASSIGNMENT RECORDED: </th>
                          <td colSpan={2} style={{ border: '1px solid black' }}>
                            <input type="date" className="et-service-input-labels" placeholder="ASSIGNMENT RECORDED:" name="assiRecorded" style={{ width: '100%' }} value={table.data.assiRecorded || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>

                        <tr>
                          <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> ADDITIONAL INFORMATION:</th>
                          <td colSpan={6} style={{ border: '1px solid black' }}>
                            <input type='text' className="et-service-input-labels" placeholder="ADDITIONAL INFORMATION" name="additionalInformation" style={{ width: '100%' }} value={table.data.additionalInformation || ''} onChange={(e) => handleInputChange2(e, table.id)} />
                          </td>
                        </tr>
                      </table>
                    </center>


                    <button className="et-service-genenal-info-add-button" onClick={handleAddTable2}>
                      <i className="pi pi-plus" style={{ marginRight: '5px' }}   ></i>Table
                    </button>
                    {table.id > 1 && (
                      <button className="et-service-genenal-info-delete-button" onClick={() => handleDeleteTable2(table.id)}>
                        <i className="pi pi-trash"     ></i> Table
                      </button>
                    )}
                    <Button className='et-service-genenal-info-save-button' label="Save&nbsp;" icon="pi pi-check" type='button' onClick={() => saveMortgageInfo(table.id)} />
                    <Button className='et-service-genenal-info-clear-button' label="Clear&nbsp;" icon="pi pi-times" type='button' onClick={() => clearMortgageInfo(table.id)} />
                  </div>
                ))}
                <br />
              </div>

              {/* --------------------------------------------------------------ACTIVE JUDGMENTS  4-----------------------------------------------*/}
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
                    {/* Table body  */}
                    <tbody>

                      {tableRowsData.map((row) => (
                        <tr key={row.id}>
                          <td style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="CASE NUMBER" name="caseNumbe" value={row.data.caseNumbe || ''} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                          </td>
                          <td style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder=" DESCRIPTION " name="description" value={row.data.description || ''} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                          </td>
                          <td style={{ border: '1px solid black' }}>
                            <input type="date" className="et-service-input-labels" placeholder="DATE RECORDED " name="dateRecorded" value={row.data.dateRecorded || ''} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                          </td>
                          <td style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" placeholder="AMOUNT" name="amount" value={row.data.amount || ''} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </center>
                <button className="et-service-genenal-info-add-button" type='button' onClick={handleAddRow}> <i className="pi pi-plus" style={{ marginRight: '5px' }}   ></i>Row</button>
                {tableRowsData.length > 3 && (
                  <button className="et-service-genenal-info-delete-button" type='button' onClick={handleDeleteLastRow}>  <i className="pi pi-trash"     ></i> Row </button>
                )}

                <Button className='et-service-genenal-info-save-button' label="Save&nbsp;" icon="pi pi-check" type='button' onClick={handleSave} />
                <Button className='et-service-genenal-info-clear-button' label="Clear&nbsp;" icon="pi pi-times" type='button' onClick={handleClear} />
              </div>


              {/* --------------------------------------------------------------TAX INFORMATION 5-----------------------------------------------*/}

              <div>
                <br />
                <br />
                <center>
                  <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >
                    <tr>
                      <th className='et-service-form-table-selftables-heading' colSpan="4">TAX INFORMATION </th>
                    </tr>
                    <tr className='th-color'>
                      <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>ASSESMENT YEAR</th>
                      <th className="et-service-form-table-selftables-heading" style={{ border: '1px solid black' }}>
                        <select
                          className="das-report-sub-heading-1"
                          style={{ border: 'none', background: 'none', outline: 'none' }}
                          value={assementYear}
                          onChange={handleAssessmentYearChange}
                        >
                          <option value="">Select Year</option>
                          {years.map((year) => (
                            <option
                              key={year} value={year}> {year}
                            </option>
                          ))}
                        </select>
                      </th>
                      <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>TAX YEAR</th>
                      <th className="et-service-form-table-selftables-heading" style={{ border: '1px solid black' }}>
                        <select
                          className="das-report-sub-heading-1"
                          style={{ border: 'none', background: 'none', outline: 'none' }}
                          value={taxYear}
                          onChange={handleTaxYearChange}
                        >
                          <option value="">Select Year</option>
                          {years.map((year) => (
                            <option
                              key={year} value={year}> {year}
                            </option>
                          ))}
                        </select>
                      </th>
                    </tr>

                    <tr>
                      <td className="et-service-side-heading-fields" colSpan='1' style={{ border: '1px solid black' }} > LAND VALUE </td>
                      <td colSpan='1' style={{ border: '1px solid black' }} >
                        <input type="text" className="et-service-input-labels" placeholder="LAND VALUE" name="landValue" value={taxinfo.landValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                      </td>
                      <td className="et-service-side-heading-fields" colSpan='1' style={{ border: '1px solid black' }} > BUILDING VALUE </td>
                      <td colSpan='1' style={{ border: '1px solid black' }} >
                        <input type="text" className="et-service-input-labels" placeholder="BUILDING VALUE" name="buildingValue" value={taxinfo.buildingValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>

                    <tr>
                      <td className="et-service-side-heading-fields" colSpan='1' style={{ border: '1px solid black' }} > TOTAL VALUE </td>
                      <td colSpan='1' style={{ border: '1px solid black' }} >
                        <input type="text" className="et-service-input-labels" placeholder="TOTAL VALUE" name="totalValue" value={taxinfo.totalValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                      </td>
                      <td className="et-service-side-heading-fields" colSpan='1' style={{ border: '1px solid black' }} > EXEMPTION </td>
                      <td colSpan='1' style={{ border: '1px solid black' }} >
                        <input type="text" className="et-service-input-labels" placeholder="EXEMPTION" name="excemption" value={taxinfo.excemption} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>

                    <tr>
                      <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>INSTALLMENT</th>
                      <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>AMOUNT</th>
                      <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>STATUS</th>
                      <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>PAID/DUE DATE</th>

                    </tr>

                    {tableTaxInstaData.map((row, index) => (
                      <tr key={index}>
                        <td colSpan='1' style={{ border: '1px solid black' }}>
                          <input type="text" className="abstract-control-input" name="installment" placeholder='installment' value={row.installment} onChange={e => handleInputChangeTaxInsta(e, index)} style={{ width: '100%' }} />
                        </td>
                        <td colSpan='1' style={{ border: '1px solid black' }}>
                          <input type="text" className="et-service-input-labels" name="amount" placeholder='AMOUNT' value={row.amount} onChange={e => handleInputChangeTaxInsta(e, index)} style={{ width: '100%' }} />
                        </td>
                        <td colSpan='1' style={{ border: '1px solid black' }}>
                          <input type="text" className="et-service-input-labels" name="status" placeholder='STATUS' value={row.status} onChange={e => handleInputChangeTaxInsta(e, index)} style={{ width: '100%' }} />
                        </td>
                        <td colSpan='1' style={{ border: '1px solid black' }}>
                          <input type="date" className="et-service-input-labels" name="paidDueDate" placeholder='DATE' value={row.paidDueDate} onChange={e => handleInputChangeTaxInsta(e, index)} style={{ width: '100%' }} />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <th style={{ border: '1px solid black' }}> NOTES </th>
                      <td colSpan={6} style={{ border: '1px solid black' }}>
                        <input type='text-area' className="et-service-input-labels" placeholder="NOTE" name="notes" value={notes} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                      </td>
                    </tr>
                  </table>
                </center>
                <button className="et-service-genenal-info-add-button" type='button' onClick={handleAddTaxInstaRow}> <i className="pi pi-plus" style={{ marginRight: '5px' }}  ></i> Row</button>
                {tableTaxInstaData.length > 2 && (
                  <button className="et-service-genenal-info-delete-button" type='button' onClick={handleDeleteLastTaxInstaRow}>
                    <i className="pi pi-trash"     ></i> Row  </button>
                )}



                <Button className='et-service-genenal-info-save-button' label="Save&nbsp;" icon="pi pi-check" type='button' onClick={handleSaveTemporarilyRow1} />
                <Button className='et-service-genenal-info-clear-button' label="Clear&nbsp;" icon="pi pi-times" type='button' onClick={handleClearRows1} />
              </div>





              {/* --------------------------------------------------------------NAMES RUNS 6-----------------------------------------------*/}
              <div>
                <br />
                <br />
                <br />
                <center>
                  <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th className='et-service-form-table-selftables-heading' colSpan={5}> NAMES RUNS </th>
                      </tr>
                      <tr className='th-color'>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black', width: '25%' }}> NAMES</th>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>  JUD </th>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}> LIENS </th>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>UCC</th>
                        <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>Others</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nameRunData.map((row) => (
                        <tr key={row.id}>
                          <td style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" name="name" placeholder='NAME' value={row.data.name} onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} />
                          </td>
                          <td style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" name="jud" placeholder='JUD' value={row.data.jud} onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} />
                          </td>
                          <td style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" name="liens" placeholder='LIENS' value={row.data.liens} onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} /></td>
                          <td style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" name="ucc" placeholder='UCC' value={row.data.ucc} onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} /></td>
                          <td style={{ border: '1px solid black' }}>
                            <input type="text" className="et-service-input-labels" name="others" placeholder='OTHER' value={row.data.others} onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </center>
                <button className="et-service-genenal-info-add-button" type='button' onClick={handleAddNameRow}> <i className="pi pi-plus" style={{ marginRight: '5px' }}></i> Row</button>
                {nameRunData.length > 2 && (
                  <button className="et-service-genenal-info-delete-button" type='button' onClick={handleDeleteLastNameRow}>  <i className="pi pi-trash"></i> Row </button>
                )}


                <Button className='et-service-genenal-info-save-button' label="Save&nbsp;" icon="pi pi-check" type='button' onClick={handleSaveTemporarilyRow} />
                <Button className='et-service-genenal-info-clear-button' label="Clear&nbsp;" icon="pi pi-times" type='button' onClick={handleClearRows} />

              </div>
              <div >
                <br />
                <center>
                  <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th className='et-service-form-table-selftables-heading' colSpan="5"> ADDITINAL INFORMATION</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan='5' style={{ border: '1px solid black' }}>
                          <textarea
                            className="abstract-control-input"
                            type="text"
                            placeholder="ADDITINAL INFORMATION"
                            name="additionalInformation"
                            value={additionalInformation}
                            onChange={onInputChangeinfo}
                            style={{ width: '100%', height: '150px' }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </center>
                <br />


              </div>
              <br />
              {/* --------------------------------------------------------------LEGAL DESCRIPTION 7-----------------------------------------------*/}
              <div>
                <br />
                <center>
                  <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >
                    <tr>
                      <th className='et-service-form-table-selftables-heading' colSpan="5">LEGAL DESCRIPTION </th>
                    </tr>
                    <tr>
                      <td colSpan='5' style={{ border: '1px solid black' }}>
                        <textarea
                          className="abstract-control-input"
                          type="text"
                          value={legaldescription || "FOR COMPLETE LEGAL DESCRIPTION SEE ATTACHED VESTING DEED\n\n\n\n"}
                          name="legaldescription"
                          onChange={onInputlegalinfo}
                          style={{ width: '100%', height: '150px' }}
                        />
                      </td>
                    </tr>

                  </table>
                  <br />
                </center>
              </div>

              {/* --------------------------------------------------------------DISCLAIMER 8-----------------------------------------------*/}
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

                    {/* <tr>
                      <td className='et-service-form-table-1-data' colSpan='1' style={{ border: '1px solid black' }}>
                        THIS TITLE SEARCH REPORT WAS PERFORMED IN ACCORDANCE WITH GENERALLY ACCEPTED STANDARDS.
                        THIS REPORT MAY NOT CONTAIN INFORMATION AFFECTING ABOVE REAL ESTATE PROPERTY THAT CANNOT
                        BE INDEXED DUE TO DIFFERENT SPELLING OF OWNER'S NAME OR INCORRECTLY RECORDED PARCEL NUMBER
                        OR RECORDER CLERK ERROR. THIS TITLE SEARCH DOES NOT INCLUDE A SEARCH OF THE RECORDS OF THE
                        CIRCUIT, PROBATE, BANKRUPTCY OR OTHER COURTS NOR ANY RECORDERS OTHER THAN THE RECORDS IN
                        THE OFFICE OF THE REGISTER OF DEEDS. TAXES ARE FOR INFORMATIONAL PURPOSES ONLY, ALL
                        INFORMATION CONTAINED HEREIN ARE OBTAINED FROM TAX COLLECTOR'S OFFICE/WEBSITE. PLEASE
                        DO CHECK FOR ANY ADDITIONAL LEVIES AND ASSESSMENTS BEFORE SETTLEMENT. E-TRACK TITLE SERVICES,
                        INC. MAKES NO WARRANTIES, AND ASSUMES NO LIABILITY WHATSOEVER FOR THE ACCURACY OF THE
                        INFORMATION CONTAINED HEREIN BEYOND THE EXERCISE OF SUCH REASONABLE CARE.</td>

                    </tr> */}









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




              {/* <button className="et-service-form-submit-button" type="submit" >
                <i className="pi pi-check"></i>Submit
              </button> 


              <button
                className="et-service-form-submit-button" type="submit" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <ProgressSpinner style={{ width: '50px', height: '24px' }} strokeWidth="4" />
                ) : (
                  <>
                    <i className="pi pi-check" style={{ marginRight: '8px' }}></i> 
                    Submit
                  </>
                )}
              </button> */}

              <button
                className="et-service-form-submit-button"
                type="submit"
                disabled={loading}

              >
                {loading ? (
                  <>
                    <ProgressSpinner style={{ width: '24px', height: '24px', marginRight: '8px' }} strokeWidth="4" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="pi pi-check" style={{ marginRight: '8px' }}></i>
                    Submit
                  </>
                )}
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
