import React from 'react'
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import UserService from '../../../implements/UserService/UserService';
import axios from "axios";

const DasReportEdit = () => {



    const location = useLocation();
    const { dasData } = location.state || {}; // Get dasData from the state


    const [loading, setLoading] = useState(false);

    console.log("Edit Page", dasData.daslegaldescriptioninfo); // Print the data to the console


    const [user, setUser] = useState({

        orderNumber: dasData.orderNumber,
        referenceNumber: dasData.referenceNumber,
        searchDate: dasData.searchDate,
        effectiveDate: dasData.effectiveDate,
        propertyAddress: dasData.propertyAddress,
        state: dasData.state,
        county: dasData.county,
        borrowerName: dasData.borrowerName,
        parcelNumber: dasData.parcelNumber,
        subdivision: dasData.subdivision,
        lotUnit: dasData.lotUnit,
        block: dasData.block,
        propertyType: dasData.propertyType,

    })

    const { orderNumber, referenceNumber, searchDate, effectiveDate, propertyAddress, state, county, parcelNumber, borrowerName, subdivision, lotUnit, block, propertyType } = user


    const [tablesData, setTablesData] = useState(
        dasData.vestingdeedinfo.map((item, index) => ({
            id: index, // Assuming `slNo` is unique and can be used as `id`
            name: 'VESTING INFORMATION', // Or any other relevant name for your table
            data: item,
        }))
    );

    // const [tablesData, setTablesData] = useState(vestingdeedinfo);


    const [tablesData2, setTablesData2] = useState(dasData.absopenmortgagedeedinfo.map((item, index) => ({
        id: index + 1,
        indicator: 0,
        data: item,
    })));

    // Assigning default Value fo the 4th table 
    const [tableRowsData, setTableRowsData] = useState(dasData.absActiveJudgementsAndLines.map((item, index) => ({
        id: index + 1,
        data: item,
    })));

    // Assigning default Value fo the 5.1th table 
    const [taxinfo, setTaxInfo] = useState({
        selectedTaxYear: "",
        assementYear: "",
        landValue: "",
        buildingValue: "",
        extraValue: "",
        totalValue: "",
        comments: "",
    })

    const { landValue, buildingValue, extraValue, totalValue, comments } = taxinfo

    // Assigning default Value fo the 5.2th table 
    const [tableTaxInstaData, setTableTaxInstaData] = useState(dasData.taxinstallments.map((item, index) => ({
        id: index, installment: item.installment, amount: item.amount, status: item.status, paidDueDate: item.paidDueDate
    })));


    // const [tableTaxInstaData, setTableTaxInstaData] = useState([
    //     { id: 1, installment: "1st Installment", amount: "", status: "", paidDueDate: "" },
    //     { id: 2, installment: "2nd Installment", amount: "", status: "", paidDueDate: "" },
    // ]);


    const [assementYear, setassementYear] = useState('');
    const [selectedTaxYear, setSelectedTaxYear] = useState('');

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = 1900; year <= currentYear; year++) {
        years.push(year.toString());
    }


    const [nameRunData, setNameRunData] = useState(dasData.namesrun.map((item, index) => ({
        id: index,
        data: item,

    })));


    const [additionalInformation, setAdditionalInformation] = useState('');
    // const [slno, setSlno] = useState(null);

    const [daslegaldesc, setdaslegaldesc] = useState({
        slno: '',
        daslegaldesc: ''
    });

    useEffect(() => {
        if (dasData && dasData.dasadditionalinformation && dasData.dasadditionalinformation.length > 0) {
            const info = dasData.dasadditionalinformation[0];

            setAdditionalInformation(info.additionalInformation);
            
            setdaslegaldesc({
                slno: dasData.daslegaldescriptioninfo[0].slno,
                daslegaldesc: dasData.daslegaldescriptioninfo[0].daslegaldesc
            });
        }
    }, [dasData]);

    //-------------------------------------------------------------------------------------------INPUT Function ------------------------------------------------------------------------
    // Table 1 input Change
    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    };


    // Table 2 Input Change

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


    // Table 3 Input Change
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

    // Table 4 Input Change
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


    // Table 5.1 Input Change


    const onInputChange2 = (e) => {
        setTaxInfo({ ...taxinfo, [e.target.name]: e.target.value })
    };

    // Table 5.2 Input Change
    const handleInputChangeTaxInsta = (e, index) => {
        const { name, value } = e.target;
        const updatedRows = [...tableTaxInstaData];
        updatedRows[index] = { ...updatedRows[index], [name]: value };
        setTableTaxInstaData(updatedRows);
    };

    const handleAssessmentYearChange = (e) => {
        setassementYear(e.target.value);
    };

    const handleTaxYearChange = (e) => {
        setSelectedTaxYear(e.target.value);
    };

    const handleChangeNameRun = (e, rowId) => {
        const { name, value } = e.target;
        setNameRunData(prevData =>
            prevData.map(row =>
                row.id === rowId ? { ...row, data: { ...row.data, [name]: value } } : row
            )
        );
    };

    const onInputChangeinfo = (event) => {
        setAdditionalInformation(event.target.value);
    };

    // Handle input change for daslegaldesc
    const onInputlegalinfo = (event) => {
        const { name, value } = event.target;
        setdaslegaldesc((prevState) => ({
            ...prevState, // Keep the existing state
            daslegaldesc: value    // Update only daslegaldesc
        }));
    };

    //------------------------------------------------------------------------------------------Submit Function---------------------------------------------------------------------

    const onSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
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
                    assessementsAndTaxInfo: [{
                        assementYear: assementYear,
                        selectedTaxYear: selectedTaxYear,
                        landValue: landValue,
                        buildingValue: buildingValue,
                        extraValue: extraValue,
                        totalValue: totalValue,
                        comments: comments
                    }],
                    taxinstallments: tableTaxInstaData.map(row => ({
                        installment: row.installment,
                        amount: row.amount,
                        status: row.status,
                        paidDueDate: row.paidDueDate
                    })),
                    namesrun: nameRunData.map(row => ({ ...row.data })),
                    dasadditionalinformation:
                        [{
                            // slno: slno, // Include slno in the payload
                            additionalInformation: additionalInformation
                        }],

                    daslegaldescriptioninfo: [
                        {
                            slno: daslegaldesc.slno,
                            daslegaldesc: daslegaldesc.daslegaldesc
                        }
                    ]
                }
            }

            console.log("Payload", payload);
            // const response = await axios.post(`${UserService.BASE_URL}/update/das`, payload, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // });
            // console.log("Response", response);
            alert("Edited Sucessfully");
        } catch (error) {
            alert("Not Updated");
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='abstract-report-container'>
                <form className='das-report-container-form' onSubmit={(e) => onSubmit(e)}>
                    <center>
                        <table style={{ border: '2px solid black', borderCollapse: 'collapse' }} >
                            <thead></thead>
                            <tbody>
                                <tr><th><h2 className='abstract-report-title' > DISCOVER ABSTRACT REPORT</h2></th></tr>
                            </tbody>
                        </table>
                    </center>
                    {/* --------------------------------------------------------------Table 1-----------------------------------------------*/}
                    <div>

                        <br />
                        <center>
                            <table className='abstract-report-tables' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <th className="das-report-main-table-heading" colSpan={8}>PROPERTY INFO </th>
                                    </tr>

                                    <tr>
                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>ORDER NUMBER</th>
                                        <td colSpan={4} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="text" style={{ width: '100%', font: 'italic' }}
                                                placeholder="ORDER NUMBER"
                                                name="orderNumber" value={user.orderNumber} onChange={(e) => onInputChange(e)} readOnly />
                                        </td>

                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>REFERENCE NUMBER</th>
                                        <td colSpan={'100%'} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="text" placeholder='REFERENCE NUMBER' name='referenceNumber' value={user.referenceNumber} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>SEARCH DATE:</th>
                                        <td colSpan={'2'} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="Date" placeholder="SEARCH DATE" name="searchDate" value={user.searchDate} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>

                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>AS OF</th>
                                        <td >7:30 Am</td>

                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>EFFECTIVE DATE:</th>
                                        <td colSpan={2} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="Date" placeholder="EFFECTIVE DATE" name="effectiveDate" value={user.effectiveDate} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>

                                    <tr>

                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>PROPERTY ADDRESS:</th>
                                        <td colSpan={6} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="text" placeholder="PROPERTY ADDRESS" name="propertyAddress" value={user.propertyAddress} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>

                                    </tr>

                                    <tr>
                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> STATE</th>
                                        <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="text" name="state" placeholder='STATE' value={user.state} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>

                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> COUNTY</th>
                                        <td colSpan={2} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="text" placeholder="COUNTY" name="county" value={user.county} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>BORROWER NAME</th>
                                        <td colSpan={6} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="text" placeholder="BORROWER NAME" name="borrowerName" value={user.borrowerName} style={{ width: '100%' }} onChange={(e) => onInputChange(e)} />
                                        </td>

                                    </tr>
                                    <tr>
                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> PARCEL NUMBER</th>
                                        <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="text" placeholder='PARCEL NUMBER' name="parcelNumber" value={user.parcelNumber} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>

                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> SUBDIVISION:</th>
                                        <td colSpan={2} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="text" placeholder="SUBDIVISION" name="subdivision" value={user.subdivision} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> LOT/UNIT:</th>
                                        <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="text" placeholder='LOT/UNIT' name="lotUnit" value={user.lotUnit} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>BLOCK</th>
                                        <td colSpan={2} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="text" placeholder="BLOCK" name="block" value={user.block} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>PROPERTY TYPE:</th>
                                        <td colSpan={'8'} style={{ border: '1px solid black' }}>
                                            <input className="abstract-control-input" type="text" placeholder='PROPERTY TYPE' name="propertyType" value={user.propertyType} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* <Button className='das-report-general-info-save-button' type='button' label="Save&nbsp;" icon="pi pi-check" onClick={savePropertyInfo} />
                            <Button className='das-report-general-info-clear-button ' type='button' label="Clear&nbsp;" icon="pi pi-times" onClick={clearPropertyInfo} /> */}
                        </center>
                    </div>
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
                                                <th className="das-report-main-table-heading" colSpan="7">{index === 0 ? table.name : `CHAIN OF TITLE ${index}`}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> DEED TYPE </th>
                                                <td colSpan={4} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="DEED TYPE" name="deedType" value={table.data.deedType || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} required />
                                                </td>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> CONSIDERATION AMOUNT ($) </th>
                                                <td colSpan={'100%'} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="CONSIDERATION AMOUNT" name="considerationAmount" value={table.data.considerationAmount || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} required />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> GRANTOR</th>
                                                <td colSpan={'6'} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="GRANTOR" name="grantor" value={table.data.grantor || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>GRANTEE</th>
                                                <td colSpan={6} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="GRANTEE" name="grantee" value={table.data.grantee || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> VESTING INFO:</th>
                                                <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="VESTING INFO" name="vesting" value={table.data.vesting || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>INSTR/BOOK/PAGE</th>
                                                <td colSpan={2} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="INSTR/BOOK/PAGE" name="instaBookPage" value={table.data.instaBookPage || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> RECORDED: </th>
                                                <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                                    <input type="date" className="abstract-control-input" placeholder="RECORDED" name="datedDate" value={table.data.datedDate || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>RECORDED DATE:</th>
                                                <td colSpan={2} style={{ border: '1px solid black' }}>
                                                    <input type="date" className="abstract-control-input" placeholder="RECORDED DATE " name="recorderdDate" value={table.data.recorderdDate || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>COMMENTS:</th>
                                                <td colSpan={6} style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="COMMENTS" name="comments" value={table.data.comments || ''} onChange={(e) => handleInputChange(e, table.id)} style={{ width: '100%' }} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>


                                    {/* <button className=" das-report-general-info-add-button" onClick={AddVestingTable}>
                                        <i className="pi pi-plus" style={{ marginRight: '8px' }}></i>Table
                                    </button> */}
                                    {/* {table.id > 1 && (
                                        <button className="das-report-general-info-delete-button" onClick={() => DeleteVestingTable(table.id)}>
                                            <i className="pi pi-trash" style={{ marginRight: '8px' }}></i> Table
                                        </button>
                                    )} */}

                                    {/* <Button className='das-report-general-info-save-button' type='button' label="Save&nbsp;" icon="pi pi-check" onClick={() => saveVestingInfo(table.id)} />
                                    <Button className='das-report-general-info-clear-button' type='button' label="Clear&nbsp;" icon="pi pi-times" onClick={() => clearVestingInfo(table.id)} /> */}
                                </center>
                            </div>
                        ))}
                        <br />
                        <br />
                    </div>


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
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> MORTGAGOR</th>
                                            <td colSpan={6} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="mortgagor" placeholder='MORTGAGOR' style={{ width: '100%' }} value={table.data.mortgagor || ''} onChange={(e) => handleChaneMortage(e, table.id)} required />                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> MORTGAGEE</th>
                                            <td colSpan={'6'} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="mortgagee" placeholder='MORTGAGEE' style={{ width: '100%' }} value={table.data.mortgagee || ''} onChange={(e) => handleChaneMortage(e, table.id)} required />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> TRUSTEE</th>
                                            <td colSpan={6} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" placeholder="TRUSTEE" name="trustee" style={{ width: '100%' }} value={table.data.trustee || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> INSTRUMENT/BOOK/PAGE</th>
                                            <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="instrBookPage" placeholder='INSTRUMENT/BOOK/PAGE' style={{ width: '100%' }} value={table.data.instrBookPage || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>AMOUNT [$]</th>
                                            <td colSpan={2} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" placeholder="$AMOUNT" name="amount" style={{ width: '100%' }} value={table.data.amount || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> DATED DATE:</th>
                                            <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                                <input type="Date" className="abstract-control-input" name="datedDate" placeholder='DATED DATE' style={{ width: '100%' }} value={table.data.datedDate || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>RECORDED DATE:</th>
                                            <td colSpan={2} style={{ border: '1px solid black' }}>
                                                <input type="Date" className="abstract-control-input" placeholder="RECORDED DATE" name="recordedDate" style={{ width: '100%' }} value={table.data.recordedDate || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={5}></td>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>MATURITY DATE:</th>
                                            <td colSpan={3} style={{ border: '1px solid black' }}>
                                                <input type="Date" className="abstract-control-input" placeholder="MATURITY DATE" name="maturityDate" style={{ width: '100%' }} value={table.data.maturityDate || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> MORTGAGE ASSIGNED TO</th>
                                            <td colSpan={'6'} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="mortgageAssignedTo" placeholder='MORTGAGE ASSIGNED TO' style={{ width: '100%' }} value={table.data.mortgageAssignedTo || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}> ASSIGNMENT BK/PG</th>
                                            <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="assignmentBkPg" placeholder='ASSIGNMENT BK/PG ' style={{ width: '100%' }} value={table.data.assignmentBkPg || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>ASSIGNMENT DATED:</th>
                                            <td colSpan={2} style={{ border: '1px solid black' }}>
                                                <input type="Date" className="abstract-control-input" placeholder="ASSIGNMENT DATED" name="assignmentDated" style={{ width: '100%' }} value={table.data.assignmentDated || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={5}></td>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>ASSIGNMENT RECORDED:</th>
                                            <td colSpan={3} style={{ border: '1px solid black' }}>
                                                <input type="Date" className="abstract-control-input" placeholder="ASSIGNMENT RECORDED" name="assignmentRecorded" style={{ width: '100%' }} value={table.data.assignmentRecorded || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>COMMENTS:</th>
                                            <td colSpan={6} style={{ border: '1px solid black' }}>
                                                <input type='text-area' className="abstract-control-input" placeholder="COMMENTS" name="comments" style={{ width: '100%' }} value={table.data.comments || ''} onChange={(e) => handleChaneMortage(e, table.id)} />
                                            </td>
                                        </tr>
                                    </table>
                                </center>
                            </div>
                        ))}
                        <br />
                    </div>

                    {/* --------------------------------------------------------------Table 4-----------------------------------------------*/}
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
                                                    <input type="text" className="abstract-control-input" placeholder="CASE NUMBER" name="caseType" value={row.data.caseType} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                                                </td>
                                                <td style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="DESCRIPTION " name="bkPgCaseNo" value={row.data.bkPgCaseNo} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                                                </td>
                                                <td style={{ border: '1px solid black' }}>
                                                    <input type="Date" className="abstract-control-input" placeholder="DATE" name="recordingDate" value={row.data.recordingDate} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                                                </td>
                                                <td style={{ border: '1px solid black' }}>
                                                    <input type="text" className="abstract-control-input" placeholder="AMOUNT" name="amount" value={row.data.amount} onChange={e => handleChange(e, row.id)} style={{ width: '100%' }} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>this is empty table</p>
                            )}

                        </center>
                        <br />
                    </div>


                    {/* --------------------------------------------------------------Table 5-----------------------------------------------*/}
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
                                        <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>
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
                                        <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>SELECTED TAX YEAR</th>
                                        <th className="das-report-sub-heading-1" style={{ border: '1px solid black' }}>
                                            <select
                                                className="das-report-sub-heading-1"
                                                style={{ border: 'none', background: 'none', outline: 'none' }}
                                                value={selectedTaxYear}
                                                onChange={handleTaxYearChange}
                                            >
                                                <option value="">Select Year</option>
                                                {years.map((year) => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th className="das-report-sub-heading" colSpan='1' style={{ border: '1px solid black' }} > LAND VALUE </th>
                                        <td colSpan='1' style={{ border: '1px solid black' }} >
                                            <input type="text" className="abstract-control-input" placeholder="LAND VALUE" name="landValue" value={taxinfo.landValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                                        </td>
                                        <th className="das-report-sub-heading" colSpan='1' style={{ border: '1px solid black' }} > BUILDING VALUE </th>
                                        <td colSpan='1' style={{ border: '1px solid black' }} >
                                            <input type="text" className="abstract-control-input" placeholder="BUILDING VALUE" name="buildingValue" value={taxinfo.buildingValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="das-report-sub-heading" colSpan='1' style={{ border: '1px solid black' }} > TOTAL VALUE </th>
                                        <td colSpan='1' style={{ border: '1px solid black' }} >
                                            <input type="text" className="abstract-control-input" placeholder="TOTAL VALUE" name="totalValue" value={taxinfo.totalValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                                        </td>
                                        <th className="das-report-sub-heading" colSpan='1' style={{ border: '1px solid black' }} > EXTRA VALUE </th>
                                        <td colSpan='1' style={{ border: '1px solid black' }} >
                                            <input type="text" className="abstract-control-input" placeholder=" EXTRA VALUE" name="extraValue" value={taxinfo.extraValue} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
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
                                            <td colSpan='1' style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="installment" placeholder='installment' value={row.installment} onChange={e => handleInputChangeTaxInsta(e, index)} style={{ width: '100%' }} />
                                            </td>
                                            <td colSpan='1' style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="amount" placeholder='AMOUNT' value={row.amount} onChange={e => handleInputChangeTaxInsta(e, index)} style={{ width: '100%' }} />
                                            </td>
                                            <td colSpan='1' style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="status" placeholder='STATUS' value={row.status} onChange={e => handleInputChangeTaxInsta(e, index)} style={{ width: '100%' }} />
                                            </td>
                                            <td colSpan='1' style={{ border: '1px solid black' }}>
                                                <input type="date" className="abstract-control-input" name="paidDueDate" placeholder='DATE' value={row.paidDueDate} onChange={e => handleInputChangeTaxInsta(e, index)} style={{ width: '100%' }} />
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <th className="das-report-sub-heading" style={{ border: '1px solid black' }}>COMMENTS</th>
                                        <td colSpan={6} style={{ border: '1px solid black' }}>
                                            <input type='text' className="abstract-control-input" placeholder=" COMMENTS" name="comments" value={comments} onChange={(e) => onInputChange2(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </center>
                    </div>



                    {/* --------------------------------------------------------------Table 6-----------------------------------------------*/}
                    <div>
                        <br />
                        <center>
                            <table className='abstract-report-tables' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th className="das-report-main-table-heading" colSpan={5}>NAMES RUNS</th>
                                    </tr>
                                    <tr >
                                        <th colSpan={1} className="das-report-sub-heading-1" style={{ border: '1px solid black', width: '25%' }}>NAMES</th>
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
                                                <input type="text" className="abstract-control-input" name="name" placeholder='NAME' value={row.data.name} onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} />
                                            </td>
                                            <td style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="jud" placeholder='JUD' value={row.data.jud} onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} />
                                            </td>
                                            <td style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="liens" placeholder='LIENS' value={row.data.liens} onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} />
                                            </td>
                                            <td style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="ucc" placeholder='UCC' value={row.data.ucc} onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} />
                                            </td>
                                            <td style={{ border: '1px solid black' }}>
                                                <input type="text" className="abstract-control-input" name="others" placeholder=' OTHERS' value={row.data.others} onChange={e => handleChangeNameRun(e, row.id)} style={{ width: '100%' }} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </center>
                    </div>
                    {/* <td className='das-report-text-line' colSpan={1} style={{ border: '1px solid black' }}>
                                        FOR COMPLETE LEGAL DESCRIPTION SEE ATTACHED VESTING DEED
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        PROPERTY ADDRESS:

                                    </td> */}

                    <div >
                        <br />
                        <center>
                            <table className='serviceform-table' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th className='das-report-main-table-heading' colSpan="5">ADDITIONAL INFORMATION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan='5' style={{ border: '1px solid black' }}>
                                            <textarea
                                                className="abstract-control-input"
                                                type="text"
                                                placeholder="ADDITIONAL INFORMATION"
                                                name="additionalInformation"
                                                value={additionalInformation}
                                                onChange={onInputChangeinfo}
                                                style={{ height: '200px' }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </center>
                        <br />


                    </div>
                    <br />



                    
                    <div className='abstractreport-container-13'>
                        <br />
                        <center>
                            <table className='abstract-report-tables' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                <tr>
                                    <th className="das-report-main-table-heading" colSpan="5"> SHORT LEGAL DESCRIPTION </th>

                                </tr>

                                <tr>



                                    <td colSpan='5' style={{ border: '1px solid black' }}>
                                        <textarea
                                            className="abstract-control-input"
                                            type="text"
                                            name="daslegaldesc"
                                            value={daslegaldesc.daslegaldesc}
                                            onChange={onInputlegalinfo}
                                            style={{ height: '200px' }}
                                        />
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
                        <button className="abstract-service-form-submit-button" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <ProgressSpinner style={{ width: '24px', height: '24px', marginRight: '8px' }} strokeWidth="4" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <i className="pi pi-check" style={{ marginRight: '8px' }}></i> Update
                                </>
                            )}
                        </button>
                    </div>



                </form>
            </div>
            <Footer />
        </div>
    )
}

export default DasReportEdit
