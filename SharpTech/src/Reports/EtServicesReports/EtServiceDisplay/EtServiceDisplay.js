import React from 'react'
import axios from 'axios';
import moment from 'moment';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import * as autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import "./EtServiceDisplay.css"
import { saveAs } from 'file-saver';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import htmlDocx from "html-docx-js/dist/html-docx";
import { ClipLoader } from 'react-spinners'; // Import ClipLoader from react-spinners
import UserService from '../../../implements/UserService/UserService';
import { useNavigate } from 'react-router-dom';
import EtServiceDoc from '../EtServiceDoc/EtServiceDoc';


function EtServiceDisplay() {
    const navigate = useNavigate();
    const [etservice, setEtService] = useState(null);
    const { orderNumber } = useParams(); // Assuming you're using React Router hooks
    const [isDownloading, setIsDownloading] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state


    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const result = await axios.get(`${UserService.BASE_URL}/display/${orderNumber}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEtService(result.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        loadUser();
    }, [orderNumber]);

    const printDocument = () => {
        const input1 = document.getElementById('pdf-content1');
        const input2 = document.getElementById('pdf-content2');
        const input3 = document.getElementById('pdf-content3');

        const generatePDF = async () => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdf.internal.pageSize.getWidth();

            const addContentToPDF = async (input) => {
                const canvas = await html2canvas(input, {
                    scrollY: -window.scrollY,
                    scale: 2 // Increase the scale for better quality and larger size
                });
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pdf.internal.pageSize.getWidth() - 20; // Adjust width to fit within margins
                const imgHeight = (canvas.height / canvas.width) * imgWidth;

                let position = 0;
                let remainingHeight = imgHeight;

                while (remainingHeight > 0) {
                    if (remainingHeight > pageHeight) {
                        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, pageHeight - 10);
                        remainingHeight -= pageHeight - 10;
                        position -= pageHeight - 10;
                        pdf.addPage();
                    } else {
                        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, remainingHeight);
                        remainingHeight = 0;
                    }
                }

            };

            await addContentToPDF(input1);
            pdf.addPage();
            await addContentToPDF(input2);
            pdf.addPage();
            await addContentToPDF(input3);

            // Generate a filename with current timestamp
            const now = new Date();
            const fileName = `et_service_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.pdf`;

            // Save the PDF with the generated filename
            pdf.save(fileName);
        };

        generatePDF();
    };
    const onEtEdit = () => {

        // console.log("On Edit", etservice);
        alert("Do you want ot edit the data???")
        navigate(`/EtServiceEdit`, { state: { etServiceData: etservice } });
    }

    const contentRef = useRef(null);
    const handleDownload = () => {
        const content = contentRef.current.innerHTML;
        const css = `
        <style>
          

        .et-display-services-container table {
             width: 100%; 
             table-layout: fixed; 
          }
           .et-service-form-table-1 {
              width: 100%;
              max-height:100%;
         
            }

           .et-service-form-table-1{
           width:100%;
           }

          .et-service-disclaimer-box{
           text-align: center;
           }
        .etract-title-service-heading{
         text-align: center;
         font-size:16px;
        }
           .et-service-form-table-sub-selftables-heading{
          background-color: rgb(212, 210, 210);
           }
            .et-service-form-table-selftables-heading {
             
                font-size: 16px;
                text-align: center;
               background-color: rgb(150, 147, 147);
            }

            .et-service-form-table-2-heading {
              
                text-align: left;
                padding-left:10px

            }

            .et-service-form-table-2-data {
                text-align: left;
                padding-left:10px

            }
                .pre-doc-font-size{
                font-size:13px;
                    font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
                    font-weight:100;

                }
      
}
        </style>
        `
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">${css}</head><body>${content}</body></html>`;
        const docxContent = htmlDocx.asBlob(html);
        saveAs(docxContent, 'et_service.docx');
    };



    return (
        <div >
            <Navbar />
            <div className="et-display-service-loader-container">
                {loading ? ( // Show the loader while loading is true
                    <div className="et-display-service-loader">
                        <ClipLoader size={150} color={"#123abc"} loading={loading} />
                    </div>
                ) : (
                    <center>
                        <div className='et-display-services-container' ref={contentRef} id="content-to-download" >


                            <div id="pdf-content1">
                                <div  >

                                    <h1 className='etract-title-service-heading'> ETRACK TITTLE SERVICES INC </h1>
                                    <br />

                                    {etservice && (
                                        <div >
                                            <center>
                                                <table className='et-service-form-table-1'
                                                    style={{ border: '2px solid black', borderCollapse: 'collapse' }}
                                                >

                                                    <tr className='et-service-form-table-1-rows' >
                                                        <th className='et-service-form-table-selftables-heading' colSpan="6"> GENERAL INFORMATION: </th>
                                                    </tr>

                                                    <tr className='et-service-form-table-1-rows'>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> ORDER NUMBER:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={3} style={{ border: '1px solid black' }}> {etservice.orderNumber} </td>

                                                        <th className='et-service-form-table-2-heading' colSpan={'1'} style={{ border: '1px solid black' }}> ET REFERENCE NUMBER: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={'1'} style={{ border: '1px solid black' }}>{etservice.refeenceNumber}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={'1'} style={{ border: '1px solid black' }}> SEARCH DATE: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={'1'} style={{ border: '1px solid black' }}> {moment(etservice.searchDate).format('MM/DD/YYYY')}</td>

                                                        <th className='et-service-form-table-2-heading' colSpan={'1'} style={{ border: '1px solid black' }}>AS OF</th>
                                                        <th className='et-service-form-table-2-data' colSpan={'1'} style={{ border: '1px solid black' }} >7:30 Am</th>

                                                        <th className='et-service-form-table-2-heading' colSpan={'1'} style={{ border: '1px solid black' }}> EFFECTIVE DATE:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={'1'} style={{ border: '1px solid black' }}>{moment(etservice.effectiveDate).format('MM/DD/YYYY')}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> PROPERTY ADDRESS:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={5} style={{ border: '1px solid black' }}>{etservice.propertyAdderess}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={'1'} style={{ border: '1px solid black' }}> STATE: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={'3'} style={{ border: '1px solid black' }}>{etservice.state}</td>

                                                        <th className='et-service-form-table-2-heading' colSpan={'1'} style={{ border: '1px solid black' }}> COUNTRY:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{etservice.country}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={'1'} style={{ border: '1px solid black' }}> PARCEL NUMBER: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={'3'} style={{ border: '1px solid black' }}>{etservice.parcelNumber}</td>

                                                        <th className='et-service-form-table-2-heading' colSpan={'1'} style={{ border: '1px solid black' }}>SUB DIVISION: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{etservice.subDivision}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={'1'} style={{ border: '1px solid black' }}> LOT/UNIT: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={'3'} style={{ border: '1px solid black' }}>{etservice.lotUnit}</td>

                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}>BLOCK:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{etservice.block}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={'1'} style={{ border: '1px solid black' }}>SFR/PUD/CONDO:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={'5'} style={{ border: '1px solid black' }}>{etservice.sfrPudCondo}</td>
                                                        {/* <td className='et-service-form-table-2-data' colSpan={'1'} style={{ border: '1px solid black' }}></td>
                                        <td className='et-service-form-table-2-data' colSpan={'1'} style={{ border: '1px solid black' }}></td> */}

                                                    </tr>
                                                </table>
                                            </center>
                                            <br />
                                            <br />
                                        </div>

                                    )}

                                    {etservice && etservice.etvestinginfo.map((vestingInfo, index) => (
                                        <div key={index}>
                                            <center>
                                                <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                                    <tr className='et-service-form-table-1-rows'>
                                                        <th className='et-service-form-table-selftables-heading' colSpan="4"> {index === 0 ? " VESTING INFORMATION " : `CHAIN OF TITLE ${index}`}  </th>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> DEED TYPE: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{vestingInfo.deedType}</td>

                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}>  CONSIDERATION AMOUNT: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>
                                                            {/* {vestingInfo.considerationAmount.startsWith('$')
                                                                ? vestingInfo.considerationAmount
                                                                : `$${vestingInfo.considerationAmount}`} */}

                                                            {vestingInfo.considerationAmount && vestingInfo.considerationAmount !== ''
                                                                ? (vestingInfo.considerationAmount.startsWith('$')
                                                                    ? vestingInfo.considerationAmount
                                                                    : `$${vestingInfo.considerationAmount}`)
                                                                : ''}

                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> GRANTOR: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={3} style={{ border: '1px solid black' }}>{vestingInfo.grantor}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> GRANTEE:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={3} style={{ border: '1px solid black' }}>{vestingInfo.grantee}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> VESTING:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{vestingInfo.vesting}</td>

                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}>INSTR/BOOK/PAGE:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{vestingInfo.instrBookPage}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> DATED DATE: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{moment(vestingInfo.datedDate).format('MM/DD/YYYY')}</td>

                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}>RECORDED DATE:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{moment(vestingInfo.recordDate).format('MM/DD/YYYY')}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}>NOTES:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={3} style={{ border: '1px solid black' }}>{vestingInfo.note}</td>

                                                    </tr>

                                                </table>
                                            </center>
                                            <br />
                                            <br />
                                        </div>
                                    ))}





                                    {etservice && etservice.etopenmortagedeedinfo.map((openmortagedeedinfo, mIndex) => (
                                        <div key={mIndex + 1} >
                                            <center>
                                                <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >
                                                    <tr className='et-service-form-table-1-rows' >
                                                        <th className='et-service-form-table-selftables-heading' colSpan="4">OPEN MORTGAGE / DEED OF TRUST  - ({mIndex = 1}) INFORMATION </th>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> MORTGAGOR:  </th>
                                                        <td className='et-service-form-table-2-data' colSpan={3} style={{ border: '1px solid black' }}>{openmortagedeedinfo.mortgago}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> MORTGAGEE: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={3} style={{ border: '1px solid black' }}>{openmortagedeedinfo.mortgagee}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> TRUSTEE: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={3} style={{ border: '1px solid black' }}>{openmortagedeedinfo.trustee}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> INSTRUMENT/BOOK/PAGE: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{openmortagedeedinfo.instBookPage}</td>

                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}>AMOUNT [$]:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>
                                                            {/* {openmortagedeedinfo.amount.startsWith('$')
                                                                ? openmortagedeedinfo.amount
                                                                : `$${openmortagedeedinfo.amount}`} */}
                                                            {/* {openmortagedeedinfo.amount?.startsWith('$')
                                                                ? openmortagedeedinfo.amount
                                                                : openmortagedeedinfo.amount != null
                                                                    ? `$${openmortagedeedinfo.amount}`
                                                                    : ''} */}
                                                            {openmortagedeedinfo.amount && openmortagedeedinfo.amount !== ''
                                                                ? (openmortagedeedinfo.amount.startsWith('$')
                                                                    ? openmortagedeedinfo.amount
                                                                    : `$${openmortagedeedinfo.amount}`)
                                                                : ''
                                                            }
                                                        </td>

                                                    </tr>


                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> DATED DATE: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{moment(openmortagedeedinfo.datedDate).format('MM/DD/YYYY')}</td>

                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}>RECORDED DATE:</th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{moment(openmortagedeedinfo.recordedDate).format('MM/DD/YYYY')}</td>
                                                    </tr>

                                                    <tr>

                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}>MATURITY DATE: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={3} style={{ border: '1px solid black' }}>{moment(openmortagedeedinfo.maturityDate).format('MM/DD/YYYY')}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> MORTGAGE ASSIGNED TO: </th>

                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{openmortagedeedinfo.mortageAssiTo}</td>

                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}>ASSIGNMENT BK/PG: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{openmortagedeedinfo.assiBkPg}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> ASSIGNMENT DATED: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{moment(openmortagedeedinfo.assiDated).format('MM/DD/YYYY')}</td>

                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}>ASSIGNMENT RECORDED: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{moment(openmortagedeedinfo.assiRecorded).format('MM/DD/YYYY')}</td>
                                                    </tr>

                                                    <tr>
                                                        <th className='et-service-form-table-2-heading' colSpan={1} style={{ border: '1px solid black' }}> ADDITIONAL INFORMATION: </th>
                                                        <td className='et-service-form-table-2-data' colSpan={3} style={{ border: '1px solid black' }}>{openmortagedeedinfo.additionalInformation === null ? "No Data" : openmortagedeedinfo.additionalInformation}</td>
                                                    </tr>
                                                </table>
                                            </center>
                                            <br />
                                            <br />
                                        </div>
                                    ))}

                                </div>

                            </div>
                            <div id="pdf-content2">


                                <br />
                                <br />
                                <div >
                                    <center>
                                        <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr className='et-service-form-table-1-rows' >
                                                    <th className='et-service-form-table-selftables-heading' colSpan={4}> ACTIVE JUDGMENTS AND LIENS</th>
                                                </tr>
                                                <tr style={{ border: '1px solid black' }}>
                                                    <th className='et-service-form-table-sub-selftables-heading' colSpan={1} style={{ border: '1px solid black' }} scope="col"> CASE NUMBER </th>
                                                    <th className='et-service-form-table-sub-selftables-heading' colSpan={1} style={{ border: '1px solid black' }} scope="col"> DESCRIPTION </th>
                                                    <th className='et-service-form-table-sub-selftables-heading' colSpan={1} style={{ border: '1px solid black' }} scope="col"> DATE RECORDED </th>
                                                    <th className='et-service-form-table-sub-selftables-heading' colSpan={1} style={{ border: '1px solid black' }} scope="col">AMOUNT</th>

                                                    {/* <th className="mx-2" scope="col">Action</th>*/}
                                                </tr>
                                            </thead>
                                            <tbody>




                                                {etservice && etservice.etactivejudgmentsandliens.map((activejudgmentsandliens, index) => (
                                                    <tr key={index} style={{ border: '1px solid black' }}>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{activejudgmentsandliens.caseNumbe}</td>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{activejudgmentsandliens.description}</td>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>{moment(activejudgmentsandliens.dateRecorded).format('MM/DD/YYYY')}</td>
                                                        <td className='et-service-form-table-2-data' colSpan={1} style={{ border: '1px solid black' }}>
                                                            {/* {activejudgmentsandliens.amount.startsWith('$')
                                                                ? activejudgmentsandliens.amount
                                                                : `$${activejudgmentsandliens.amount}`} */}
                                                            {/* {activejudgmentsandliens.amount?.startsWith('$')
                                                                ? activejudgmentsandliens.amount
                                                                : activejudgmentsandliens.amount != null
                                                                    ? `$${activejudgmentsandliens.amount}`
                                                                    : ''} */}

                                                            {activejudgmentsandliens.amount && activejudgmentsandliens.amount !== ''
                                                                ? (activejudgmentsandliens.amount.startsWith('$')
                                                                    ? activejudgmentsandliens.amount
                                                                    : `$${activejudgmentsandliens.amount}`)
                                                                : ''
                                                            }
                                                        </td>


                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </center>
                                    <br />
                                    <br />
                                </div>

                                {etservice && etservice.ettaxinformation.map((taxinformation, tindex) => (
                                    <div id="taxInformation" key={tindex}>
                                        <center>
                                            <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >
                                                <tr className='et-service-form-table-1-rows' >
                                                    <th className='et-service-form-table-selftables-heading' colSpan="4">TAX INFORMATION </th>
                                                </tr>
                                                <tr   >
                                                    <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>ASSESMENT YEAR</th>
                                                    <td className="et-service-form-table-sub-selftables-heading" style={{ border: '1px solid black' }} colSpan={1}>{taxinformation.assementYear}</td>
                                                    <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>TAX YEAR</th>
                                                    <td className="et-service-form-table-sub-selftables-heading" style={{ border: '1px solid black' }} colSpan={1}>{taxinformation.taxYear}</td>
                                                </tr>

                                                <tr>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }} > LAND VALUE </td>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }} >
                                                        {/* {taxinformation.landValue.startsWith('$')
                                                            ? taxinformation.landValue
                                                            : `$${taxinformation.landValue}`} */}
                                                        {/* {taxinformation.landValue?.startsWith('$')
                                                            ? taxinformation.landValue
                                                            : taxinformation.landValue != null
                                                                ? `$${taxinformation.landValue}`
                                                                : ''} */}
                                                        {taxinformation.landValue && taxinformation.landValue !== ''
                                                            ? (taxinformation.landValue.startsWith('$')
                                                                ? taxinformation.landValue
                                                                : `$${taxinformation.landValue}`)
                                                            : ''
                                                        }
                                                    </td>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }} > BUILDING VALUE  </td>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }} >
                                                        {/* {taxinformation.buildingValue.startsWith('$')
                                                            ? taxinformation.buildingValue
                                                            : `$${taxinformation.buildingValue}`} */}
                                                        {/* {taxinformation.buildingValue?.startsWith('$')
                                                            ? taxinformation.buildingValue
                                                            : taxinformation.buildingValue != null
                                                                ? `$${taxinformation.buildingValue}`
                                                                : ''} */}

                                                        {taxinformation.buildingValue && taxinformation.buildingValue !== ''
                                                            ? (taxinformation.buildingValue.startsWith('$')
                                                                ? taxinformation.buildingValue
                                                                : `$${taxinformation.buildingValue}`)
                                                            : ''
                                                        }
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }} > TOTAL VALUE </td>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }} >
                                                        {/* {taxinformation.totalValue.startsWith('$')
                                                            ? taxinformation.totalValue
                                                            : `$${taxinformation.totalValue}`} */}
                                                        {/* {taxinformation.totalValue?.startsWith('$')
                                                            ? taxinformation.totalValue
                                                            : taxinformation.totalValue != null
                                                                ? `$${taxinformation.totalValue}`
                                                                : ''} */}
                                                        {taxinformation.totalValue && taxinformation.totalValue !== ''
                                                            ? (taxinformation.totalValue.startsWith('$')
                                                                ? taxinformation.totalValue
                                                                : `$${taxinformation.totalValue}`)
                                                            : ''
                                                        }
                                                    </td>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }} > EXEMPTION </td>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }} >
                                                        {/* {taxinformation.excemption.startsWith('$')
                                                            ? taxinformation.excemption
                                                            : `$${taxinformation.excemption}`} */}
                                                        {/* {taxinformation.excemption?.startsWith('$')
                                                            ? taxinformation.excemption
                                                            : taxinformation.excemption != null
                                                                ? `$${taxinformation.excemption}`
                                                                : ''} */}
                                                        {taxinformation.excemption && taxinformation.excemption !== ''
                                                            ? (taxinformation.excemption.startsWith('$')
                                                                ? taxinformation.excemption
                                                                : `$${taxinformation.excemption}`)
                                                            : ''
                                                        }
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>INSTALLMENT</th>
                                                    <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>AMOUNT</th>
                                                    <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>STATUS</th>
                                                    <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>PAID/DUE DATE</th>

                                                </tr>
                                                {etservice && etservice.ettaxinstallment.map((taxinstallment, tindex) => (
                                                    <tr key={tindex}>
                                                        <td className='et-service-form-table-2-data' colSpan='1' style={{ border: '1px solid black' }} >{tindex === 0 ? `${tindex + 1}ST INSTALLMENT` : tindex === 1 ? ` ${tindex + 1}ND INSTALLMENT` : tindex === 2 ? `${tindex + 1}RD INSTALLMENT` : `${tindex + 1}th INSTALLMENT`}</td>
                                                        <td className='et-service-form-table-2-data' colSpan='1' style={{ border: '1px solid black' }} >
                                                            {/* {taxinstallment.amount.startsWith('$')
                                                                ? taxinstallment.amount
                                                                : `$${taxinstallment.amount}`} */}
                                                            {/* {taxinstallment.amount?.startsWith('$')
                                                                ? taxinstallment.amount
                                                                : taxinstallment.amount != null
                                                                    ? `$${taxinstallment.amount}`
                                                                    : ''} */}
                                                            {/* {taxinstallment.amount && taxinstallment.amount !== ''
                                                                ? (taxinstallment.amount.startsWith('$')
                                                                    ? taxinstallment.amount
                                                                    : `$${taxinstallment.amount}`)
                                                                : ''
                                                            } */}
                                                            {taxinstallment.amount && taxinstallment.amount !== ''
                                                                ? (taxinstallment.amount.startsWith('$')
                                                                    ? taxinstallment.amount
                                                                    : `$${taxinstallment.amount}`)
                                                                : ''
                                                            }
                                                        </td>

                                                        <td className='et-service-form-table-2-data' colSpan='1' style={{ border: '1px solid black' }} >{taxinstallment.status}</td>
                                                        <td className='et-service-form-table-2-data' colSpan='1' style={{ border: '1px solid black' }} >{moment(taxinstallment.paidDueDate).format('MM/DD/YYYY')}</td>
                                                    </tr>
                                                ))}


                                                <tr>
                                                    <th className='et-service-form-table-sub-selftables-heading' colSpan={1} style={{ border: '1px solid black' }}> NOTES </th>
                                                    <td className='et-service-form-table-2-data' colSpan={3} style={{ border: '1px solid black', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{taxinformation.notes}</td>
                                                </tr>
                                            </table>
                                        </center>
                                        <br />
                                        <br />
                                    </div>
                                ))}


                                <div id="namesRuns">

                                    <center>
                                        <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                            <tr className='et-service-form-table-1-rows' >
                                                <th className='et-service-form-table-selftables-heading' colSpan={5}>NAMES RUNS</th>
                                            </tr>
                                            <tr    >
                                                <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>NAMES</th>
                                                <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>  JUD </th>
                                                <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}> LIENS </th>
                                                <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>UCC</th>
                                                <th className='et-service-form-table-sub-selftables-heading' style={{ border: '1px solid black' }}>OTHERS</th>
                                            </tr>

                                            {etservice && etservice.etnameruns.map((nameruns, nindex) => (
                                                <tr key={nindex}>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }}>{nameruns.name}</td>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }}>{nameruns.jud === null ? "X" : nameruns.jud}</td>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }}>{nameruns.liens === null ? "X" : nameruns.liens}</td>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }}>{nameruns.ucc === null ? "X" : nameruns.ucc}</td>
                                                    <td className='et-service-form-table-2-data' style={{ border: '1px solid black' }}>{nameruns.others === null ? "X" : nameruns.others}</td>
                                                </tr>
                                            ))}
                                        </table>
                                    </center>
                                    <br />
                                    <br />
                                </div>
                                {etservice && etservice.etadditionalinformation.map((additionalinfo, tindex) => (
                                    <div className='abstractreport-container-12'>
                                        <br />
                                        <center>
                                            <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr>
                                                        <th className="et-service-form-table-selftables-heading" colSpan='7'>ADDITIONAL INFORMATION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan='7' className="et-service-form-table-2-data" style={{ width: '100%', border: '1px solid black' }}>
                                                            {/* <pre style={{
                                                                whiteSpace: 'pre-wrap', // Ensures the text wraps if it's too long
                                                                wordWrap: 'break-word', // Prevents long words from overflowing
                                                                fontSize: '16px',
                                                                fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
                                                            }}>  {additionalinfo.additionalInformation || " "}</pre> */}


                                                            <pre className="pre-doc-font-size">
                                                                {additionalinfo.additionalInformation || ""}
                                                            </pre>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                    </div>
                                ))}
                                <br />
                                <br />

                                {etservice && etservice.etlegaldescriptioninfo.map((ledgerdescriptioninfo, tindex) => (
                                    <div id="legalDescription" key={tindex}>
                                        <center>
                                            <table className="et-service-form-table-1" style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr className="et-service-form-table-1-rows">
                                                        <th className="et-service-form-table-selftables-heading" colSpan={1}>LEGAL DESCRIPTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="et-service-form-table-2-data" style={{ border: '1px solid black' }}>

                                                            {/* <pre style={{
                                                                whiteSpace: 'pre-wrap', // Ensures the text wraps if it's too long
                                                                wordWrap: 'break-word', // Prevents long words from overflowing
                                                                fontSize: '16px',
                                                                fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif',

                                                            }}>{ledgerdescriptioninfo.legaldescription || "FOR COMPLETE LEGAL DESCRIPTION SEE ATTACHED VESTING DEED\n\n"}</pre> */}


                                                            <pre className="pre-doc-font-size">
                                                                {ledgerdescriptioninfo.legaldescription || "FOR COMPLETE LEGAL DESCRIPTION SEE ATTACHED VESTING DEED\n\n"}
                                                            </pre>
                                                            PARCEL NUMBER: {etservice.parcelNumber || " "}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>


                                    </div>
                                ))}
                            </div>


                            <div id="pdf-content3">
                                <br />

                                <div id="disclaimer">
                                    <center>
                                        <table className='et-service-form-table-1' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >
                                            <tr className='et-service-form-table-1-rows' >
                                                <th className='et-service-form-table-selftables-heading' colSpan={1}>DISCLAIMER</th>
                                            </tr>

                                            <tr>
                                                <td colSpan={1} className='et-service-form-table-2-data' style={{ border: '1px solid black' }}>
                                                    <p className='et-et-service-disclaimer-box'>This title search report was performed in
                                                        accordance with generally accepted standards. This report may
                                                        not contain information affecting above real estate property
                                                        that cannot be indexed due to different spelling of owner's
                                                        name or incorrectly recorded parcel number or recorder clerk
                                                        error. This title search does not include a search of the
                                                        records of the circuit, probate, bankruptcy or other courts
                                                        nor any recorders other than the records in the office of the
                                                        Register of Deeds. Taxes are informational purposes only, all
                                                        information contained herein are obtained from Tax Collectors
                                                        office/website. Please do check for any additional levies and
                                                        assessments before settlement. E-Track Title Services, Inc.
                                                        makes no warranties, and assumes no liability whatsoever for
                                                        the accuracy of the information contained herein beyond
                                                        the exercise of such reasonable care.
                                                        {/* THIS TITLE SEARCH REPORT WAS PERFORMED IN ACCORDANCE WITH GENERALLY ACCEPTED STANDARDS. THIS REPORT MAY NOT CONTAIN INFORMATION AFFECTING ABOVE REAL ESTATE PROPERTY THAT CANNOT BE INDEXED DUE TO DIFFERENT SPELLING OF OWNER'S NAME OR INCORRECTLY RECORDED PARCEL NUMBER OR RECORDER CLERK ERROR. THIS TITLE SEARCH DOES NOT INCLUDE A SEARCH OF THE RECORDS OF THE CIRCUIT, PROBATE, BANKRUPTCY OR OTHER COURTS NOR ANY RECORDERS OTHER THAN THE RECORDS IN THE OFFICE OF THE REGISTER OF DEEDS. TAXES ARE INFORMATIONAL PURPOSES ONLY, ALL INFORMATION CONTAINED HEREIN ARE OBTAINED FROM TAX COLLECTORS OFFICE/WEBSITE. PLEASE DO CHECK FOR ANY ADDITIONAL LEVIES AND ASSESSMENTS BEFORE SETTLEMENT. E-TRACK TITLE SERVICES, INC. MAKES NO WARRANTIES, AND ASSUMES NO LIABILITY WHATSOEVER FOR THE ACCURACY OF THE INFORMATION CONTAINED HEREIN BEYOND THE EXERCISE OF SUCH REASONABLE CARE. */}

                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </center>
                                    <br />

                                </div>


                                <br />
                                <br />


                            </div>
                            <center>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    <button className='et-service-display-doc-button' onClick={handleDownload}>Download DOCX</button>
                                    <button className='et-service-display-pdf-button' onClick={printDocument}>Download PDF</button>
                                    <button className='et-service-display-pdf-button' onClick={onEtEdit}>Edit Data</button>
                                    {/* <EtServiceDoc
                                        etServiceData={etservice}
                                    /> 
                                   <button className='et-service-display-edit-button'>EditReport</button> */}
                                </div>
                            </center>
                        </div>
                    </center>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default EtServiceDisplay
