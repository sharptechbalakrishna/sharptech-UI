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

    // console.log("Edit Page", dasData.vestingdeedinfo); // Print the data to the console
    
    
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


    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    };

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
                }
            }
            
            console.log("Payload", payload);
           const response = await axios.post(`${UserService.BASE_URL}/update/das`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("Response", response);
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
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default DasReportEdit
