
import React from 'react'
import { useState, useEffect } from 'react';
import axios from "axios";
import "./DasReport.css";
import { Button } from 'primereact/button';
import Footer from '../../../components/Footer/Footer';
import Navbar from '../../../components/Navbar/Navbar';

function DasReport() {


    const [user, setUser] = useState({

        orderNumber: "",
        referenceNumber: "",
        searchDate: "",
        effectiveDate: "",
        propertyAddress: "",
        state: "",
        county: "",
        borrowerName: "",
        parcelNumber: "",
        subdivision: "",
        lotUnit: "",
        block: "",
        propertyType: "",

    })

    const { orderNumber, referenceNumber, searchDate, effectiveDate, propertyAddress, state, county, parcelNumber, borrowerName,

        subdivision, lotUnit, block, propertyType } = user



    {/**const [tablesData, setTablesData] = useState([{ id: 1, data: {} }]); */ }

    const [tablesData, setTablesData] = useState([{ id: 1, indicator: 0, data: {}, name: 'VESTING INFORMATION' }]);
    const [nextTableId, setNextTableId] = useState(2);




    const [tablesData2, setTablesData2] = useState([{ id: 1, indicator: 0, data: {} }]);
    const [nextTableId2, setNextTableId2] = useState(2);

    const [tableRowsData, setTableRowsData] = useState([
        { id: 1, data: { caseType: '', bkPgCaseNo: '', recordingDate: '', amount: '' } },
        { id: 2, data: { caseType: '', bkPgCaseNo: '', recordingDate: '', amount: '' } },
        { id: 3, data: { caseType: '', bkPgCaseNo: '', recordingDate: '', amount: '' } }
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



    const [taxinfo, setTaxInfo] = useState({
        taxYear: "",
        landValue: "",
        buildingValue: "",
        extraValue: "",
        totalValue: "",
        comments: "",
    })

    const { taxYear, landValue, buildingValue, extraValue, totalValue, comments } = taxinfo

    const onInputChange2 = (e) => {
        setTaxInfo({ ...taxinfo, [e.target.name]: e.target.value })
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
    // const handleRowInputChange = (e, rowId) => {
    //     const { name, value } = e.target;
    //     const updatedRows = tableRowsData.map(row =>
    //         row.id === rowId ? { ...row, data: { ...row.data, [name]: value } } : row
    //     );
    //     setTableRowsData(updatedRows);
    // };


    // Function to add a new row


    const getTableName = (index) => {
        if (index === 1) return 'VESTING INFORMATION';
        else return `CHAIN OF TITLE ${index - 1}`;
    };

    const [amount, setAmount] = useState('');

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

    const formatValueForDisplay = (value) => {
        if (value === null || value === undefined || isNaN(value)) {
            return '';
        }
        // Ensure value is converted to a number before applying toFixed
        const numericValue = Number(value);
        return `$${numericValue.toFixed(2)}`;
    };
    const handleChaneMortage = (e, tableId) => {
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

    const handleChangeNameRun = (e, rowId) => {
        const { name, value } = e.target;
        setNameRunData(prevData =>
            prevData.map(row =>
                row.id === rowId ? { ...row, data: { ...row.data, [name]: value } } : row
            )
        );
    };
    //saveDataToLocalStorage(updatedNameRunData);

    const handleInputChangeTaxInsta = (e, index) => {
        const { name, value } = e.target;
        const updatedRows = [...tableTaxInstaData];
        updatedRows[index] = { ...updatedRows[index], [name]: value };
        setTableTaxInstaData(updatedRows);
    };

    const [showDeleteButton, setShowDeleteButton] = useState(false);

    //   const getTableName = (id) => `Table ${id}`;

    const AddVestingTable = (e) => {
        e.preventDefault();
        const newTableId = nextTableId;
        const newName = getTableName(newTableId); // const newTableId = tablesData.length + 1;

        const newIndicator = tablesData.length;
        setTablesData([...tablesData, { id: newTableId, indicator: newIndicator, data: {}, name: newName }]);
        setNextTableId(newTableId + 1);
    };

    const DeleteVestingTable = (tableId) => {
        const updatedTables = tablesData.filter(table => table.id !== tableId);
        setTablesData(updatedTables);

        // Remove specific table data from localStorage
        localStorage.removeItem(`vestingTableData_${tableId}`);

        // Update overall tables data in localStorage
        localStorage.setItem('vestingInfo', JSON.stringify(updatedTables));
    };



    const AddMortageTable = (e) => {
        e.preventDefault();
        const newTableId2 = nextTableId2;   // const newTableId = tablesData.length + 1;       
        const newIndicator = tablesData2.length;
        setTablesData2([...tablesData2, { id: newTableId2, indicator: newIndicator, data: {} }]);
        setNextTableId2(newTableId2 + 1);
    };

    const DeleteMortageTable = (tableId) => {
        // Filter out the table to delete
        const updatedTables2 = tablesData2.filter(table => table.id !== tableId);
        setTablesData2(updatedTables2);

        // Remove specific mortgage table data from localStorage
        localStorage.removeItem(`mortgageTableData_${tableId}`);

        // Update overall mortgage tables data in localStorage
        localStorage.setItem('mortgageInfo', JSON.stringify(updatedTables2));
    };


    const handleAddRow = () => {
        const newRowId = tableRowsData.length + 1;
        const newRow = { id: newRowId, data: { caseType: '', bkPgCaseNo: '', recordingDate: '', amount: '' } };
        setTableRowsData([...tableRowsData, newRow]);
    };

    const handleDeleteLastRow = () => {
        if (tableRowsData.length > 0) {
            const updatedRows = tableRowsData.slice(0, -1); // Remove the last row
            setTableRowsData(updatedRows);
            localStorage.setItem('tableRowsData', JSON.stringify(updatedRows)); // Update local storage
        }
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
        e.preventDefault();
        const newTableTaxInstaId = nextTableTaxInstaId;
        const newRow = { id: newTableTaxInstaId, amount: '', status: '', paidDueDate: '' }; // Initialize fields
        setTableTaxInstaData([...tableTaxInstaData, newRow]);
        setNextTableTaxInstaId(newTableTaxInstaId + 1);
    };

    const handleDeleteLastTaxInstaRow = () => {
        if (tableTaxInstaData.length > 0) {
            const updatedRows = tableTaxInstaData.slice(0, -1); // Remove the last row
            setTableTaxInstaData(updatedRows);
            localStorage.setItem('tableTaxInstaData', JSON.stringify(updatedRows));
        }
    };



    {/*const handleAddTable = (e) => {
    e.preventDefault();
    const newTableId = tablesData.length + 1;
    setTablesData([...tablesData, { id: newTableId, data: {} }]);
};*/}

    // the below code is for save and clear for the first table data

    const onInputChange = (e) => {

        setUser({ ...user, [e.target.name]: e.target.value })


    };

    useEffect(() => {

        const savedPropertyInfo = localStorage.getItem('propertyInfo');
        if (savedPropertyInfo) {
            setUser(JSON.parse(savedPropertyInfo));
        }

        const savedVestingInfo = localStorage.getItem('vestingInfo');
        if (savedVestingInfo) {
            const parsedData = JSON.parse(savedVestingInfo);

            // Iterate through parsedData and set each table's data
            const updatedTables = parsedData.map(data => ({
                id: data.id,
                name: data.name,
                data: {
                    mortgagor: data.data.mortgagor || '',
                    mortgagee: data.data.mortgagee || '',
                    trustee: data.data.trustee || '',
                    instrBookPage: data.data.instrBookPage || '', // Corrected from instBookPage to instrBookPage
                    amount: data.data.amount || '',
                    deedType: data.data.deedType || '',
                    considerationAmount: data.data.considerationAmount || '',
                    grantor: data.data.grantor || '',
                    grantee: data.data.grantee || '',
                    vesting: data.data.vesting || '',
                    instaBookPage: data.data.instaBookPage || '',  // Ensure the name matches
                    datedDate: data.data.datedDate || '',
                    recorderdDate: data.data.recorderdDate || '',  // Ensure the name matches
                    comments: data.data.comments || ''  // Ensure the name matches
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
                    mortgagor: data.data.mortgagor || '',
                    mortgagee: data.data.mortgagee || '',
                    trustee: data.data.trustee || '',
                    instrBookPage: data.data.instrBookPage || '', // Corrected from instBookPage to instrBookPage
                    amount: data.data.amount || '',
                    datedDate: data.data.datedDate || '',
                    recordedDate: data.data.recordedDate || '',
                    maturityDate: data.data.maturityDate || '',
                    mortgageAssignedTo: data.data.mortgageAssignedTo || '', // Corrected from mortageAssiTo to mortgageAssignedTo
                    assignmentBkPg: data.data.assignmentBkPg || '', // Corrected from assiBkPg to assignmentBkPg
                    assignmentDated: data.data.assignmentDated || '', // Corrected from assiDated to assignmentDated
                    assignmentRecorded: data.data.assignmentRecorded || '', // Corrected from assiRecorded to assignmentRecorded
                    comments: data.data.comments || '' // Corrected from additionalInformation to comments
                }
            }));

            setTablesData2(updatedTables2);
            setNextTableId2(parsedData2.length + 1);
        }

        const savedActiveJudgment = localStorage.getItem('tableRowsData');
        if (savedActiveJudgment) {
            setTableRowsData(JSON.parse(savedActiveJudgment));
            setNextRowsId(JSON.parse(savedActiveJudgment).length + 1);
        }

        const namerundata = localStorage.getItem('nameRunData');
        if (namerundata) {
            const parsedData = JSON.parse(namerundata);
            setNameRunData(parsedData);
            setNextNameRunId(parsedData.length + 1);
        }

        const savedTaxInfo = JSON.parse(localStorage.getItem('taxInformation'));
        const savedTableData = JSON.parse(localStorage.getItem('tableTaxInstaData'));
        if (savedTaxInfo) {
            setTaxInfo(savedTaxInfo);
        }
        if (savedTableData) {
            setTableTaxInstaData(savedTableData);
        }

    }, []);



    const savePropertyInfo = () => {
        localStorage.setItem('propertyInfo', JSON.stringify(user));
        window.alert("Property Info Saved Successfully");
    };

    const clearPropertyInfo = () => {
        setUser({
            orderNumber: '',
            referenceNumber: '',
            searchDate: '',
            effectiveDate: '',
            propertyAddress: '',
            state: '',
            county: '',
            borrowerName: '',
            parcelNumber: '',
            subdivision: '',
            lotUnit: '',
            block: '',
            propertyType: ''
        });
        localStorage.removeItem('PropertyInfo');
        window.alert("Property Info Cleared");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const tempUserData = JSON.parse(localStorage.getItem('tempUserData'));

        if (tempUserData) {
            // Perform HTTP request to save data permanently to the database
            axios.post('/api/saveFormData', tempUserData)
                .then(response => {
                    console.log("Data saved successfully!", response.data);
                    // Clear local storage after saving data to the database
                    clearPropertyInfo();
                    alert("Data saved successfully to the database!");
                })
                .catch(error => {
                    console.error("Error saving data:", error);
                    alert("An error occurred while saving data. Please try again.");
                });
        } else {
            alert("No data to submit!");
        }
        localStorage.removeItem('tableRowsData');
    };



    // the below code is for save and clear for the second table table data

    const saveVestingInfo = (tableId) => {
        const tableData = tablesData.find(table => table.id === tableId);
        localStorage.setItem(`vestingTableData_${tableId}`, JSON.stringify(tableData));
        window.alert('Table Data Saved Successfully');

        // Update overall tables data in localStorage
        localStorage.setItem('vestingInfo', JSON.stringify(tablesData));
    };

    const clearVestingInfo = (tableId) => {
        if (tableId === 1) {
            // If it's the only table, just clear the data
            const updatedTables = tablesData.map(table => {
                if (table.id === tableId) {
                    return { ...table, data: {} };
                }
                return table;
            });
            setTablesData(updatedTables);
            localStorage.removeItem(`vestingTableData_${tableId}`);
            window.alert('Table Data Cleared');
            localStorage.setItem('vestingInfo', JSON.stringify(updatedTables));
        } else {
            // If there are multiple tables, remove the table
            const updatedTables = tablesData.filter(table => table.id !== tableId);
            setTablesData(updatedTables);
            localStorage.removeItem(`vestingTableData_${tableId}`);
            window.alert('Table Data Cleared and Table Deleted');
            localStorage.setItem('vestingInfo', JSON.stringify(updatedTables));
        }
    };

    const saveMortgageInfo = (tableId) => {
        const tableData = tablesData2.find(table => table.id === tableId);
        localStorage.setItem(`mortgageTableData_${tableId}`, JSON.stringify(tableData));
        window.alert('Table Data Saved Successfully');

        localStorage.setItem('mortgageInfo', JSON.stringify(tablesData2));
    };


    const clearMortgageInfo = (tableId) => {
        if (tableId === 1) {
            // If it's the only table, just clear the data
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
        } else {
            // If there are multiple tables, remove the table
            const updatedTables = tablesData2.filter(table => table.id !== tableId);
            setTablesData2(updatedTables);
            localStorage.removeItem(`mortgageTableData_${tableId}`);
            window.alert('Table Data Cleared and Table Deleted');
            localStorage.setItem('mortgageInfo', JSON.stringify(updatedTables));
        }
    };


    //save and clear for activejudgements and lines
    const saveActiveJudgment = () => {
        localStorage.setItem('tableRowsData', JSON.stringify(tableRowsData));
        alert('Active saved successfully!');
    };


    const clearActiveJudgment = () => {
        const clearedRows = tableRowsData.map(row => ({
            ...row,
            data: {
                caseType: '',
                bkPgCaseNo: '',
                recordingDate: '',
                amount: ''
            }
        }));
        setTableRowsData(clearedRows);
        localStorage.removeItem('tableRowsData'); // Clear local storage
        alert('Active judgments cleared successfully!');
    };

    //save and clear function for taxinfo
    const handleSaveTemporarilyTaxInstaRow = () => {
        localStorage.setItem('taxInformation', JSON.stringify(taxinfo));
        localStorage.setItem('tableTaxInstaData', JSON.stringify(tableTaxInstaData));
        alert('Data saved to local storage!');
    };

    const handleClearTaxInstaRows = () => {
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
        });
    };
    //save and clear for namesand run

    const handleSaveTemporarilyNameRunRow = () => {
        localStorage.setItem('nameRunData', JSON.stringify(nameRunData));
        alert('Data saved successfully!');
    };

    const handleClearNameRunRows = () => {
        const clearedRows = nameRunData.map(row => ({
            ...row,
            data: {
                name: '',
                jud: '',
                liens: '',
                ucc: '',
                others: ''
            }
        }));
        setNameRunData(clearedRows);
        localStorage.removeItem('nameRunData'); // Clear local storage
        alert('Data cleared successfully!');
    };

    const [tablesDataD, setTablesDataD] = useState([
        { id: 1, name: 'Table 1' },
        { id: 2, name: 'Table 2' },
        { id: 3, name: 'Table 3' }
    ]);

    const handleInputChangeD = (e, tableId) => {
        // Handle input change here
    };

    const handleDeleteTableD = (tableId) => {
        setTablesDataD(tablesDataD.filter(table => table.id !== tableId));
    };

    const onSubmit = async (e) => {

        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            const payload = {
                propertyinfo: {
                    orderNumber: orderNumber,
                    referenceNumber: referenceNumber,
                    searchDate: searchDate,
                    effectiveDate: effectiveDate,
                    propertyAddress: propertyAddress,
                    state: state,
                    county: county,
                    borrowerName: borrowerName,
                    parcelNumber: parcelNumber,
                    subdivision: subdivision,
                    lotUnit: lotUnit,
                    block: block,
                    propertyType: propertyType,

                    vestingdeedinfo: tablesData.map(table => ({ ...table.data })),
                    absopenmortgagedeedinfo: tablesData2.map(table => ({ ...table.data })),
                    absActiveJudgementsAndLines: tableRowsData.map(table => ({ ...table.data })),

                    assessementsAndTaxInfo: [
                        {

                            taxYear: taxYear,
                            landValue: landValue,
                            buildingValue: buildingValue,
                            extraValue: extraValue,
                            totalValue: totalValue,
                            comments: comments

                        }
                    ],
                    namesrun: nameRunData.map(row => ({ ...row.data })),
                    taxinstallments: tableTaxInstaData.map(row => ({
                        amount: row.amount,
                        status: row.status,
                        paidDueDate: row.paidDueDate
                    })),
                }
            };
            await axios.post("http://localhost:8080/insert", payload, {

                headers: {
                    'Authorization': `Bearer ${token}`
                }

            });
            console.log(payload);
            window.alert("Data Sent Sucessfully");


        } catch (error) {
            console.error("Registration failed:", error);
            // Handle error if registration fails
        }


    };

    return (
        <div>
            <Navbar />
            <div className='abstract-report-container'>
                <form className='das-report-container-form' onSubmit={(e) => onSubmit(e)}>
                    <center>
                        <table style={{ border: '2px solid black', borderCollapse: 'collapse' }} >
                            <tr><th><h2 className='abstract-report-title' > DISCOVER ABSTRACT REPORT</h2></th></tr>
                        </table>
                    </center>
                    {/* --------------------------------------------------------------Table 1-----------------------------------------------*/}
                    <div>

                        <br />
                        <center>
                            <table className='abstract-report-tables' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                <tr>
                                    <th className="das-report-main-table-heading" colSpan={8}>PROPERTY INFO </th>
                                </tr>

                                <tr>
                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>ORDER NUMBER :</th>
                                    <td colSpan={4} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="text" placeholder="Enter order Number" name="orderNumber" value={user.orderNumber} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                    </td>

                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>REFERENCE NUMBER :</th>
                                    <td colSpan={'100%'} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="text" placeholder='Enter Reference Number' name='referenceNumber' value={user.referenceNumber} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                    </td>
                                </tr>

                                <tr>
                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>SEARCH DATE :</th>
                                    <td colSpan={'2'} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="Date" placeholder="Enter Serch Data" name="searchDate" value={user.searchDate} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                    </td>

                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>AS OF</th>
                                    <td >7:30 Am</td>

                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>EFFECTIVE DATE :</th>
                                    <td colSpan={2} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="Date" placeholder="Enter Effective Data " name="effectiveDate" value={user.effectiveDate} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                    </td>
                                </tr>

                                <tr>

                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>PROPERTY ADDRESS :</th>
                                    <td colSpan={6} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="text" placeholder="Enter Address " name="propertyAddress" value={user.propertyAddress} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                    </td>

                                </tr>

                                <tr>
                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> STATE : </th>
                                    <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="text" name="state" placeholder='Enter State' value={user.state} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                    </td>

                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> COUNTY :</th>
                                    <td colSpan={2} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="text" placeholder="Enter Country" name="county" value={user.county} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                    </td>
                                </tr>

                                <tr>
                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>BORROWER NAME :</th>
                                    <td colSpan={6} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="text" placeholder="Enter Notes" name="borrowerName" value={user.borrowerName} style={{ width: '100%' }} onChange={(e) => onInputChange(e)} />
                                    </td>

                                </tr>
                                <tr>
                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> PARCEL NUMBER :</th>
                                    <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="text" placeholder='Enter Parcel Number' name="parcelNumber" value={user.parcelNumber} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                    </td>

                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> SUBDIVISION : </th>
                                    <td colSpan={2} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="text" placeholder="Enter Sub Division" name="subdivision" value={user.subdivision} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                    </td>
                                </tr>

                                <tr>
                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> LOT/UNIT </th>
                                    <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="text" placeholder='Enter Unit' name="lotUnit" value={user.lotUnit} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                    </td>
                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>BLOCK:</th>
                                    <td colSpan={2} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="text" placeholder="Enter Block" name="block" value={user.block} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                    </td>
                                </tr>

                                <tr>
                                    <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>PROPERTY TYPE:</th>
                                    <td colSpan={'8'} style={{ border: '1px solid black' }}>
                                        <input className="abstract-control-input" type="text" placeholder='Enter SFR/PUD/CONDO' name="propertyType" value={user.propertyType} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                    </td>
                                </tr>

                            </table>

                            <br />

                            <Button className='das-report-general-info-save-button' type='button' label="Save&nbsp;" icon="pi pi-check" onClick={savePropertyInfo} />
                            <Button className='das-report-general-info-clear-button ' type='button' label="Clear&nbsp;" icon="pi pi-times" onClick={clearPropertyInfo} />
                        </center>
                    </div>

                    <br />
                    <br />
                    {/* --------------------------------------------------------------Table 2-----------------------------------------------*/}

                    <div>
                        {tablesData.map((table, index) => (
                            <div key={table.id}>
                                <br />
                                <center>
                                    <table className='abstract-report-tables' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th className="das-report-main-table-heading" colSpan="7">{table.name}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> DEED TYPE </th>
                                                <td colSpan={4} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="Enter Deed Type" name="deedType" value={table.data.deedType || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} required />
                                                </td>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> CONSIDERATION AMOUNT ($) </th>
                                                <td colSpan={'100%'} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="Enter Consideration Amount" name="considerationAmount" value={table.data.considerationAmount || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} required />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> GRANTOR : </th>
                                                <td colSpan={'6'} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="Enter Grantor" name="grantor" value={table.data.grantor || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>GRANTEE : </th>
                                                <td colSpan={6} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="Enter Grantee" name="grantee" value={table.data.grantee || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> VESTING INFO :</th>
                                                <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="Enter Vesting" name="vesting" value={table.data.vesting || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>INSTR/BOOK/PAGE:</th>
                                                <td colSpan={2} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="Enter INSTR/BOOK/PAGE" name="instaBookPage" value={table.data.instaBookPage || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> DATED DATE: </th>
                                                <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                                    <input type="date" className="abstract-control-input" placeholder="Enter Date" name="datedDate" value={table.data.datedDate || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>RECORDED DATE:</th>
                                                <td colSpan={2} style={{ border: '1px solid black' }}>
                                                <input type="date" className="abstract-control-input" placeholder="Enter Date" name="recorderdDate" value={table.data.recorderdDate || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>COMMENTS :</th>
                                                <td colSpan={6} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="Enter Notes" name="comments" value={table.data.comments || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <br />
                                    {table.id > 1 && (
                                        <button className="das-report-delete-button-table" onClick={() => DeleteVestingTable(table.id)}>
                                            <i className="pi pi-trash" style={{ marginRight: '8px' }}></i> Table
                                        </button>
                                    )}
                                    <button className=" das-report-add-button-table" onClick={AddVestingTable}>
                                        <i className="pi pi-plus" style={{ marginRight: '8px' }}></i>Table
                                    </button>
                                    <br />

                                    <Button className='das-report-general-info-save-button' type='button' label="Save&nbsp;" icon="pi pi-check" onClick={() => saveVestingInfo(table.id)} />
                                    <Button className='das-report-general-info-clear-button' type='button' label="Clear&nbsp;" icon="pi pi-times" onClick={() => clearVestingInfo(table.id)} />
                                </center>
                            </div>
                        ))}
                        <br />


                        <br />

                        <br />

                        <br />



                    </div>

                    <br />
                    <br />

                    {/* --------------------------------------------------------------Table 3-----------------------------------------------*/}
                    <div>
                        {tablesData2.map((table, index) => (
                            <div key={table.id} >
                                <br />

                                <center>
                                    <table className='abstract-report-tables' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                        <tr>
                                            <th className="das-report-main-table-heading" colSpan="7">OPEN MORTGAGE / DEED OF TRUST  ({table.id}) </th>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> MORTGAGOR :</th>
                                            <td colSpan={6} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="mortgagor" placeholder='Enter MORTGAGEE' style={{ width: '100%' }} value={table.data.mortgagor || ''} onChange={(e) => handleChaneMortage(e, table.id)} required />                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> MORTGAGEE :</th>
                                            <td colSpan={'6'} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="mortgagee" placeholder='Enter MORTGAGEE' style={{ width: '100%' }} value={table.data.mortgagee || ''} onChange={(e) => handleChaneMortage(e, table.id)} required />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> TRUSTEE :</th>
                                            <td colSpan={6} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" placeholder="Enter TRUSTEE" name="trustee" style={{ width: '100%' }} value={table.data.trustee || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> INSTRUMENT/BOOK/PAGE :</th>
                                            <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="instrBookPage" placeholder='Enter INSTRUMENT/BOOK/PAGE:' style={{ width: '100%' }} value={table.data.instrBookPage || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>AMOUNT [$]:</th>
                                            <td colSpan={2} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" placeholder="$ Enter Amount" name="amount" style={{ width: '100%' }} value={table.data.amount || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> DATED DATE:</th>
                                            <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                                <input type="Date" className="abstract-control-input" name="datedDate" placeholder='Enter DATED DATE:' style={{ width: '100%' }} value={table.data.datedDate || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>RECORDED DATE:</th>
                                            <td colSpan={2} style={{ border: '1px solid black' }}>
                                                <input type="Date" className="abstract-control-input" placeholder="Enter RECORDED DATE" name="recordedDate" style={{ width: '100%' }} value={table.data.recordedDate || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={5}></td>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>MATURITY DATE :</th>
                                            <td colSpan={3} style={{ border: '1px solid black' }}>
                                                <input type="Date" className="abstract-control-input" placeholder="Enter Maturity Date" name="maturityDate" style={{ width: '100%' }} value={table.data.maturityDate || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> MORTGAGE ASSIGNED TO</th>
                                            <td colSpan={'6'} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="mortgageAssignedTo" placeholder='Enter MORTGAGE ASSIGNED TO' style={{ width: '100%' }} value={table.data.mortgageAssignedTo || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> ASSIGNMENT BK/PG :</th>
                                            <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="assignmentBkPg" placeholder='Enter ASSIGNMENT BK/PG :' style={{ width: '100%' }} value={table.data.assignmentBkPg || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>ASSIGNMENT DATED :</th>
                                            <td colSpan={2} style={{ border: '1px solid black' }}>
                                                <input type="Date" className="abstract-control-input" placeholder="Enter ASSIGNMENT DATED" name="assignmentDated" style={{ width: '100%' }} value={table.data.assignmentDated || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={5}></td>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>ASSIGNMENT RECORDED :</th>
                                            <td colSpan={3} style={{ border: '1px solid black' }}>
                                                <input type="Date" className="abstract-control-input" placeholder="Enter ASSIGNMENT RECORDED:" name="assignmentRecorded" style={{ width: '100%' }} value={table.data.assignmentRecorded || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>COMMENTS :</th>
                                            <td colSpan={6} style={{ border: '1px solid black' }}>
                                                <input type='text-area' className="abstract-control-input" placeholder="Enter COMMENTS" name="comments" style={{ width: '100%' }} value={table.data.comments || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                    </table>


                                    {table.id > 1 && (

                                        <button className="das-report-delete-button-table" onClick={() => DeleteMortageTable(table.id)}> <i className="pi pi-trash" style={{ marginRight: '8px' }}></i> Table</button>
                                    )} <button className=" das-report-add-button-table" onClick={AddMortageTable}> <i className="pi pi-plus" style={{ marginRight: '8px' }}></i>Table</button>
                                    <br />
                                    <Button className='das-report-general-info-save-button' type='button' label="Save&nbsp;" icon="pi pi-check" onClick={() => saveMortgageInfo(table.id)} />
                                    <Button className='das-report-general-info-clear-button' type='button' label="Clear&nbsp;" icon="pi pi-times" onClick={() => clearMortgageInfo(table.id)} />
                                </center>
                            </div>
                        ))}
                        <br />
                    </div>

                    <br />
                    <br />

                    <div>
                        <br />
                        <center>
                            {tableRowsData.length > 0 ? (
                                <table className='abstract-report-tables' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                    {/* Table headers */}
                                    <thead>
                                        <tr className='header-table'>
                                            <th className="das-report-main-table-heading" colSpan={4}>ACTIVE JUDGMENTS AND LIENS</th>
                                        </tr>
                                        <tr className='th-color'>
                                            <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>CASE NUMBER</th>
                                            <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>DESCRIPTION</th>
                                            <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>DATE RECORDED</th>
                                            <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>AMOUNT</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {tableRowsData.map((row) => (
                                            <tr key={row.id}>
                                                <td style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="Enter Case Number" name="caseType" value={row.data.caseType} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                                                </td>
                                                <td style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="Enter Description" name="bkPgCaseNo" value={row.data.bkPgCaseNo} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                                                </td>
                                                <td style={{ border: '1px solid black' }}>
                                                    <input type="Date" className="abstract-control-input" placeholder="Enter Date" name="recordingDate" value={row.data.recordingDate} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                                                </td>
                                                <td style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="Enter Amount" name="amount" value={row.data.amount} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>this is empty table</p>
                            )}

                            <br />
                            <button className=" das-report-add-button" type='button' onClick={handleAddRow}> <i className="pi pi-plus" style={{ marginRight: '8px' }}></i>Row</button>

                            {tableRowsData.length > 3 && (

                                <button className="das-report-delete-button" type='button' onClick={handleDeleteLastRow}>    <i className="pi pi-trash" style={{ marginRight: '8px' }}></i>Row</button>
                            )}
                            <br />

                            <Button className='das-report-general-info-save-button' type='button' label="Save&nbsp;" icon="pi pi-check" onClick={saveActiveJudgment} />
                            <Button className='das-report-general-info-clear-button' type='button' label="Clear&nbsp;" icon="pi pi-times" onClick={clearActiveJudgment} />

                        </center>
                        <br />
                    </div>


                    <br />
                    <br />

                    <div>
                        <br />
                        <center>
                            <table className='abstract-report-tables' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >
                                <thead>
                                    <tr>
                                        <th className="das-report-main-table-heading" colSpan="4">TAX INFORMATION</th>
                                    </tr>
                                    <tr className='th-color'>
                                        <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>ASSESMENT YEAR</th>
                                        <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>2023</th>
                                        <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>TAX YEAR</th>
                                        <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>2023</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th className="das-report-sub-heading" colSpan='1' style={{ border: '1px solid black' }} > LAND VALUE </th>
                                        <td colSpan='1' style={{ border: '1px solid black' }} >
                                            <input type="text" className="abstract-control-input" placeholder="Enter LandValue" name="landValue" value={taxinfo.landValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                                        </td>
                                        <th className="das-report-sub-heading" colSpan='1' style={{ border: '1px solid black' }} > BUILDING VALUE </th>
                                        <td colSpan='1' style={{ border: '1px solid black' }} >
                                            <input type="text" className="abstract-control-input" placeholder="Enter BuildingValue" name="buildingValue" value={taxinfo.buildingValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="das-report-sub-heading" colSpan='1' style={{ border: '1px solid black' }} > TOTAL VALUE </th>
                                        <td colSpan='1' style={{ border: '1px solid black' }} >
                                            <input type="text" className="abstract-control-input" placeholder="Enter TotalValue" name="totalValue" value={taxinfo.totalValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                                        </td>
                                        <th className="das-report-sub-heading" colSpan='1' style={{ border: '1px solid black' }} > EXTRAVALUE </th>
                                        <td colSpan='1' style={{ border: '1px solid black' }} >
                                            <input type="text" className="abstract-control-input" placeholder="Enter extraValue" name="extraValue" value={taxinfo.extraValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>INSTALLMENT</th>
                                        <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>AMOUNT</th>
                                        <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>STATUS</th>
                                        <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>PAID/DUE DATE</th>
                                    </tr>
                                    {tableTaxInstaData.map((row, index) => (
                                        <tr key={row.id}>
                                            <th className="das-report-sub-heading" colSpan='1' style={{ border: '1px solid black' }}>
                                                {index + 1 === 1 ? `${index + 1}ST INSTALLMENT ` : index + 1 === 2 ? `${index + 1}ND INSTALLMENT` : index + 1 === 3 ? `${index + 1}RD INSTALLMENT` : `${index + 1}TH INSTALLMENT`}
                                            </th>
                                            <td colSpan='1' style={{ border: '1px solid black' }} >
                                                <input type="text" className="abstract-control-input" name="amount" placeholder='Enter Amount' value={row.amount} onChange={e => handleInputChangeTaxInsta(e, index)} style={{ width: '100%' }} />
                                            </td>
                                            <td colSpan='1' style={{ border: '1px solid black' }} >
                                                <input type="text" className="abstract-control-input" name="status" placeholder='Enter Status' value={row.status} onChange={e => handleInputChangeTaxInsta(e, index)} style={{ width: '100%' }} />
                                            </td>
                                            <td colSpan='1' style={{ border: '1px solid black' }} >
                                                <input type="date" className="abstract-control-input" name="paidDueDate" placeholder='Enter Date' value={row.paidDueDate} onChange={e => handleInputChangeTaxInsta(e, index)} style={{ width: '100%' }} />
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>COMMENTS</th>
                                        <td colSpan={6} style={{ border: '1px solid black' }}>
                                            <input type='text' className="abstract-control-input" placeholder="Enter Notes" name="comments" value={comments} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <br />

                            {tableTaxInstaData.length > 2 && (

                                <button className="das-report-delete-button" type='button' onClick={handleDeleteLastTaxInstaRow}>  <i className="pi pi-trash" style={{ marginRight: '8px' }}></i> Row</button>
                            )}<button className="das-report-add-button " type='button' onClick={handleAddTaxInstaRow}> <i className="pi pi-plus" style={{ marginRight: '8px' }}></i>Row</button>

                            <br />

                            <Button className='das-report-general-info-save-button' type='button' label="Save&nbsp;" icon="pi pi-check" onClick={handleSaveTemporarilyTaxInstaRow} />
                            <Button className='das-report-general-info-clear-button' type='button' label="Clear&nbsp;" icon="pi pi-times" onClick={handleClearTaxInstaRows} />
                        </center>
                    </div>

                    <br />
                    <br />

                    <div>
                        <br />
                        <center>
                            <table className='abstract-report-tables' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th className="das-report-main-table-heading" colSpan={5}>NAMES RUNS</th>
                                    </tr>
                                    <tr >
                                        <th colSpan={1} className="das-report-sub-heading-1" style={{ border: '1px solid black', width: '25%' }}>NAME</th>
                                        <th colSpan={1} className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>JUD</th>
                                        <th colSpan={1} className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>LINES</th>
                                        <th colSpan={1} className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>UCC</th>
                                        <th colSpan={1} className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>OTHERS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nameRunData.map((row) => (
                                        <tr key={row.id}>
                                            <td style={{ border: '1px solid black' }}>
                                                <input
                                                    type="text"
                                                    className="abstract-control-input"
                                                    name="name"
                                                    placeholder='Enter Name'
                                                    value={row.data.name}
                                                    onChange={e => handleChangeNameRun(e, row.id)}
                                                    style={{ width: '100%' }}
                                                />
                                            </td>
                                            <td style={{ border: '1px solid black' }}>
                                                <input
                                                    type="text"
                                                    className="abstract-control-input"
                                                    name="jud"
                                                    placeholder='Enter JUD'
                                                    value={row.data.jud}
                                                    onChange={e => handleChangeNameRun(e, row.id)}
                                                    style={{ width: '100%' }}
                                                />
                                            </td>
                                            <td style={{ border: '1px solid black' }}>
                                                <input
                                                    type="text"
                                                    className="abstract-control-input"
                                                    name="liens"
                                                    placeholder='Enter LIENS'
                                                    value={row.data.liens}
                                                    onChange={e => handleChangeNameRun(e, row.id)}
                                                    style={{ width: '100%' }}
                                                />
                                            </td>
                                            <td style={{ border: '1px solid black' }}>
                                                <input
                                                    type="text"
                                                    className="abstract-control-input"
                                                    name="ucc"
                                                    placeholder='Enter UCC'
                                                    value={row.data.ucc}
                                                    onChange={e => handleChangeNameRun(e, row.id)}
                                                    style={{ width: '100%' }}
                                                />
                                            </td>
                                            <td style={{ border: '1px solid black' }}>
                                                <input
                                                    type="text"
                                                    className="abstract-control-input"
                                                    name="others"
                                                    placeholder='Enter Others'
                                                    value={row.data.others}
                                                    onChange={e => handleChangeNameRun(e, row.id)}
                                                    style={{ width: '100%' }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <br />

                            <button className=" das-report-add-button" type='button' onClick={handleAddNameRow}> <i className="pi pi-plus" style={{ marginRight: '8px' }}></i>Row</button>
                            {nameRunData.length > 2 && (
                                <button className="das-report-delete-button" type='button' onClick={handleDeleteLastNameRow}>
                                    <i className="pi pi-trash" style={{ marginRight: '8px' }}></i> Row</button>
                            )}
                            <br />

                            <Button className='das-report-general-info-save-button' type='button' label="Save&nbsp;" icon="pi pi-check" onClick={handleSaveTemporarilyNameRunRow} />
                            <Button className='das-report-general-info-clear-button' type='button' label="Clear&nbsp;" icon="pi pi-times" onClick={handleClearNameRunRows} />
                        </center>
                    </div>

                    <br />
                    <br />

                    <div className='abstractreport-container-13'>
                        <br />
                        <center>
                            <table className='abstract-report-tables' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                <tr>
                                    <th className="das-report-main-table-heading" colSpan="5"> SHORT LEGAL DESCRIPTION </th>

                                </tr>

                                <tr>

                                    <td className='das-report-text-line' colSpan={1} style={{ border: '1px solid black' }}>
                                        FOR COMPLETE LEGAL DESCRIPTION SEE ATTACHED VESTING DEED
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        PROPERTY ADDRESS:

                                    </td>
                                    <br />
                                </tr>

                            </table>
                        </center>
                    </div>


                    <br />
                    <br />

                    <div className='abstractform-container-11'>
                        <center>
                            <table className='abstract-report-tables' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >

                                <tr>
                                    <th className="das-report-main-table-heading" colSpan="5">DISCLAIMER</th>
                                </tr>

                                <tr>
                                    <td className='das-report-text-line' colSpan='1' style={{ border: '1px solid black' }}>This title search report was performed in accordance with generally accepted standards. This report may not contain information
                                        affecting above real estate property that cannot be indexed due to different spelling of owner's name or incorrectly recorded
                                        parcel number or recorder clerk error. Taxes are informational purposes only, all information contained herein are obtained
                                        from Tax collectors office/website. Please do check for any additional levies and assessments before settlement. We makes no
                                        warranties, and assumes no liability whatsoever for the accuracy of the information contained herein beyond the exercise of
                                        such reasonable care.</td>
                                </tr>

                            </table>
                        </center>

                    </div>


                    <br />
                    <br />

                    <button className="das-report-submit-button" type="Submit">  <i className="pi pi-check" style={{ marginRight: '8px' }}></i>Submit  </button>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default DasReport
