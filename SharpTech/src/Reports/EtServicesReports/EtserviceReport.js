import React from 'react'
import 'primereact/resources/themes/saga-blue/theme.css';  // Or any other theme you prefer
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import './EtServices/EtServices.css';
import { Button } from 'primereact/button';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

function EtserviceReport() {

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
    });

    const { orderNumber, refeenceNumber, searchDate, effectiveDate, propertyAdderess, state, country, parcelNumber, subDivision, lotUnit, block, sfrPudCondo } = user;

    const [tablesData, setTablesData] = useState([{ id: 1, indicator: 0, data: {}, name: 'VESTING INFORMATION' }]);
    const [nextTableId, setNextTableId] = useState(2);

    const getTableName = (index) => {
        if (index === 0) return 'VESTING INFORMATION';
        else return `CHAIN OF TITLE ${index - 1}`;
    };

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


    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleInputChange = (e, tableId) => {
        const { name, value } = e.target;
        const updatedTablesData = tablesData.map(table => {
            if (table.id === tableId) {
                return {
                    ...table,
                    data: {
                        ...table.data,
                        [name]: value,
                    },
                };
            }
            return table;
        });
        setTablesData(updatedTablesData);
    };


    const handleAddTable = (e) => {
        e.preventDefault();
        const newTableId = nextTableId;
        const newName = getTableName(newTableId);

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

    const saveTableData = (tableId) => {
        const tableData = tablesData.find(table => table.id === tableId);
        localStorage.setItem(`vestingTableData_${tableId}`, JSON.stringify(tableData));
        window.alert('Table Data Saved Successfully');

        // Update overall tables data in localStorage
        localStorage.setItem('vestingInfo', JSON.stringify(tablesData));
    };

    const clearTableData = (tableId) => {
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
    }, []);



    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                etgeneralinfo: {
                    orderNumber,
                    refeenceNumber,
                    searchDate,
                    effectiveDate,
                    propertyAdderess,
                    state,
                    country,
                    parcelNumber,
                    subDivision,
                    lotUnit,
                    block,
                    sfrPudCondo,
                    etvestinginfo: tablesData.map(table => ({ indicator: table.indicator, ...table.data }))
                }
            };
            await axios.post("http://localhost:8080/etinsert", payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            window.alert("Data Sent Successfully");
        } catch (error) {
            console.error("Registration failed:", error);
            window.alert("Data Not Sent Something went Wrong");
        }
    };






    return (
        <div>
            <Navbar />
            <div className='et-services-container'>
                <form className="et-services-form-container" onSubmit={(e) => onSubmit(e)}>
                    <table className='et-services-main-table-border'>


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
                                            <input className="et-service-input-labels" type="text" placeholder="Enter order Number" name="orderNumber" value={user.orderNumber} onChange={onInputChange} style={{ width: '100%' }} required />
                                        </td>
                                        <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> ET REFERENCE NUMBER </th>
                                        <td className='et-service-form-table-1-data' colSpan={'100%'} style={{ border: '1px solid black' }}>
                                            <input className="et-service-input-labels" type="text" placeholder='Enter Reference Number' name='refeenceNumber' value={user.refeenceNumber} onChange={onInputChange} style={{ width: '100%' }} />
                                        </td>
                                    </tr>

                                    <tr className='et-service-form-table-1-rows'>
                                        <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>SEARCH DATE</th>
                                        <td className='et-service-form-table-1-data' colSpan={'2'} style={{ border: '1px solid black' }}>
                                            <input className="et-service-input-labels" type="Date" placeholder="Enter Serch Data" name="searchDate" value={user.searchDate} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>

                                        <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>AS OF</th>
                                        <td className='et-service-form-table-1-data' >7:30 Am</td>

                                        <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> EFFECTIVE DATE </th>
                                        <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                                            <input className="et-service-input-labels" type="Date" placeholder="Enter Effective Data " name="effectiveDate" value={user.effectiveDate} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>

                                    <tr className='et-service-form-table-1-rows'>

                                        <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> PROPERTY ADDRESS</th>
                                        <td className='et-service-form-table-1-data' colSpan={6} style={{ border: '1px solid black' }}>
                                            <input className="et-service-input-labels" type="text" placeholder="Enter Address " name="propertyAdderess" value={user.propertyAdderess} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>

                                    </tr>

                                    <tr className='et-service-form-table-1-rows'>
                                        <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> STATE </th>
                                        <td colSpan={'4'} style={{ border: '1px solid black' }}>
                                            <input className="et-service-input-labels" type="text" name="state" placeholder='Enter State' value={user.state} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>

                                        <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> COUNTRY</th>
                                        <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                                            <input className="et-service-input-labels" type="text" placeholder="Enter Country" name="country" value={user.country} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>

                                    <tr className='et-service-form-table-1-rows'>
                                        <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> PARCEL NUMBER</th>
                                        <td className='et-service-form-table-1-data' colSpan={'4'} style={{ border: '1px solid black' }}>
                                            <input className="et-service-input-labels" type="text" placeholder='Enter Parcel Number' name="parcelNumber" value={user.parcelNumber} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>

                                        <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> SUB DIVISION</th>
                                        <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                                            <input className="et-service-input-labels" type="text" placeholder="Enter Sub Division" name="subDivision" value={user.subDivision} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>

                                    <tr className='et-service-form-table-1-rows'>
                                        <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> LOT/UNIT  </th>
                                        <td className='et-service-form-table-1-data' colSpan={'4'} style={{ border: '1px solid black' }}>
                                            <input className="et-service-input-labels" type="text" placeholder='Enter Unit' name="lotUnit" value={user.lotUnit} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                        <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}>BLOCK</th>
                                        <td className='et-service-form-table-1-data' colSpan={2} style={{ border: '1px solid black' }}>
                                            <input className="et-service-input-labels" type="text" placeholder="Enter Block" name="block" value={user.block} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                    </tr>

                                    <tr className='et-service-form-table-1-rows'>
                                        <th className='et-service-form-table-1-heading' style={{ border: '1px solid black' }}> SFR/PUD/CONDO</th>
                                        <td className='et-service-form-table-1-data' colSpan={'4'} style={{ border: '1px solid black' }}>
                                            <input className="et-service-input-labels" type="text" placeholder='Enter SFR/PUD/CONDO' name="sfrPudCondo" value={user.sfrPudCondo} onChange={(e) => onInputChange(e)} style={{ width: '100%' }} />
                                        </td>
                                        <td colSpan={'1'} style={{ border: '1px solid black' }}></td>
                                        <td colSpan={'1'} style={{ border: '1px solid black' }}></td>

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
                                            <i className="pi pi-trash" style={{ marginRight: '8px' }}></i> Table</button>
                                    )}
                                    <button className="et-services-add-button" onClick={handleAddTable}> <i className="pi pi-plus" style={{ marginRight: '8px' }}></i>Table</button>

                                    <Button onClick={() => saveTableData(table.id)} type='button'>Save Table Data</Button>
                                    <br />
                                    <br />
                                    <Button onClick={() => clearTableData(table.id)} type='button'>Clear Table Data</Button>

                                </div>
                            ))}



                            <br />
                        </div>
                        <br />

                        {/* --------------------------------------------------------------Table 3-----------------------------------------------*/}






                        {/* --------------------------------------------------------------Table 4-----------------------------------------------*/}



                        {/* --------------------------------------------------------------Table 5-----------------------------------------------*/}



                        {/* --------------------------------------------------------------Table 6-----------------------------------------------*/}



                        {/* --------------------------------------------------------------Table 7-----------------------------------------------*/}


                        {/* --------------------------------------------------------------Table 8-----------------------------------------------*/}

                        {/* --------------------------------------------------------------Table 9-----------------------------------------------*/}



                        <button className="et-service-form-submit-button" type="submit"> <i className="pi pi-check" style={{ marginRight: '8px' }}></i>Submit
                        </button>

                    </table>
                </form>

            </div>
            <br />
            <br />
            <Footer />
        </div>
    )
}

export default EtserviceReport
