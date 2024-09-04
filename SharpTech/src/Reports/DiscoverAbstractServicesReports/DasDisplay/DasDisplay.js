//reddy -code display
import moment from 'moment';
import React from 'react';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import * as autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableRow, TableCell } from "docx";
import htmlDocx from 'html-docx-js/dist/html-docx';
import "./DasDisplay.css"
import Footer from '../../../components/Footer/Footer';
import Navbar from '../../../components/Navbar/Navbar';
import { ClipLoader } from 'react-spinners'; // Import ClipLoader from react-spinners
import UserService from '../../../implements/UserService/UserService';
import { useNavigate } from 'react-router-dom';


function DasDisplay() {

    const navigate = useNavigate();
    const [etservice, setEtService] = useState(null);
    const { orderNumber } = useParams(); // Assuming you're using React Router hooks
    const [isDownloading, setIsDownloading] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state


    useEffect(() => {
        const loadEtService = async () => {
            try {
                const token = localStorage.getItem('token');
                const result = await axios.get(`${UserService.BASE_URL}/fetch/${orderNumber}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEtService(result.data);
                console.log(result.data);
            } catch (error) {
                console.error('Error fetching et service details:', error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        loadEtService();

        return () => {
            // Clean up any remaining state or effects here if needed
        };
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

                // Add current date and time at the bottom of the page
                const now = new Date();
                const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
                const textWidth = pdf.getStringUnitWidth(formattedDate) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
                const textX = (pdf.internal.pageSize.getWidth() - textWidth) / 2;
                const textY = pdf.internal.pageSize.getHeight() - 10;
                pdf.text(formattedDate, textX, textY, { align: 'center' });
            };

            await addContentToPDF(input1);
            pdf.addPage();
            await addContentToPDF(input2);
            pdf.addPage();
            await addContentToPDF(input3);

            // Construct filename with current date
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD
            // const formattedDate = currentDate.toLocaleDateString('en-US');
            const filename = `das_service_${formattedDate}.pdf`; // Filename with current date

            // Save PDF with filename
            pdf.save(filename);
        };

        generatePDF();
    };


    //commit by reddy

    const contentRef = useRef(null);
    const handleDownload = () => {
        const content = contentRef.current.innerHTML;
        const css = `
            <style>
                /* General styling */
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    font-size: 14px;
                    color: #000;
                    margin: 0;
                    padding: 0;
                }
                    .das-display-side-headings
                    {
                    text-align: left;
                    padding-left:5px;
                    }
                .das-display-overall-heading {
                    font-size: 22px;
                    padding-top: 10px;
                    background-color: #db815d;
                    color: black;
                    border-radius: 10px;
                }
                .das-display-sub-title-headings {
                    background-color: #93c0f3;
                }
                .das-display-header-table {
                    background-color: #7fb9f7;
                    padding-top: 10px;
                }
                .das-report-display-data {
                    text-align: left;
                    padding-left:5px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
            </style>
        `;

        // Corrected HTML string with escaped quotes around content
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">${css}</head><body>${content}</body></html>`;

        const docxContent = htmlDocx.asBlob(html);

        // Get the current date
        const currentDate = new Date();

        // Format the date as YYYY-MM-DD (you can adjust the format as needed)
        const formattedDate = currentDate.toISOString().slice(0, 10);

        // Construct the filename with the date appended
        const filename = `Das_Report_${formattedDate}.docx`;

        // Save the DOCX file with the filename including the date
        saveAs(docxContent, filename);
    };

    const editReport = () => {

        console.log("Edit Data", etservice);
        alert("Edit Pressed")
        navigate(`/DasReportEdit`, { state: { dasData: etservice } });
    }


    return (
        <div>
            <Navbar />
            <div className="das-display-loader-container">
                {loading ? ( // Show the loader while loading is true
                    <div className="das-display-loader">
                        <ClipLoader size={150} color={"#123abc"} loading={loading} />
                    </div>
                ) : (
                    <div className='abstractform-container' ref={contentRef} id="content-to-download">
                        {/* <h1>{data.creator ? data.creator.name : 'Unknown Creator'}</h1> */}
                        <div id="pdf-content1">
                            <br />
                            <br />
                            {/* First set of content to be converted */}
                            {/* <img src="your-image-url.jpg" alt="Your Image" style={{ width: '100%', height: 'auto' }} /> */}
                            <div >

                                <center>
                                    <table className='das-display-report-heading' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                        <tr> <th className='das-display-overall-heading'>DISCOVER ABSTRACT REPORT </th> </tr>
                                    </table>
                                </center>
                                <br />
                                <br />
                                {/* -----------------------------------------Table-1----------------------------------------------------- */}
                                {etservice && (
                                    <div>
                                        <center>
                                            {etservice && (
                                                <div>
                                                    <center>
                                                        <table className='das-display-table' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                                            <tr>
                                                                <th className="das-display-header-table" style={{ marginBottom: '10px' }} colSpan={6}>PROPERTY INFO </th>
                                                            </tr>

                                                            <tr>
                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>ORDER NUMBER</th>
                                                                <td className="das-report-display-data" colSpan={3} style={{ border: '1px solid black' }}>{etservice.orderNumber} </td>
                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>REFERENCE NUMBER</th>
                                                                <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>  {etservice.referenceNumber} </td>
                                                            </tr>

                                                            <tr>
                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>SEARCH DATE:</th>
                                                                <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}> {moment(etservice.searchDate).format('MM/DD/YYYY')}  </td>


                                                                <th className="das-display-side-headings" c colSpan={1} style={{ border: '1px solid black' }}>As Of</th>
                                                                <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }} >7:30 Am</td>

                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>EFFECTIVE DATE :</th>
                                                                <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}> {moment(etservice.effectiveDate).format('MM/DD/YYYY')} </td>
                                                            </tr>

                                                            <tr>

                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>PROPERTY ADDRESS :</th>
                                                                <td className="das-report-display-data" colSpan={5} style={{ border: '1px solid black' }}>  {etservice.propertyAddress} </td>

                                                            </tr>

                                                            <tr>
                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> STATE : </th>
                                                                <td className="das-report-display-data" colSpan={3} style={{ border: '1px solid black' }}>  {etservice.state}  </td>

                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> COUNTY :</th>
                                                                <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}> {etservice.county}  </td>
                                                            </tr>

                                                            <tr>
                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>BORROWER NAME :</th>
                                                                <td className="das-report-display-data" colSpan={5} style={{ border: '1px solid black' }}>  {etservice.borrowerName}</td>

                                                            </tr>
                                                            <tr>
                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> PARCEL NUMBER :</th>
                                                                <td className="das-report-display-data" colSpan={3} style={{ border: '1px solid black' }}>  {etservice.parcelNumber} </td>

                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> SUBDIVISION : </th>
                                                                <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}> {etservice.subdivision} </td>
                                                            </tr>

                                                            <tr>
                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> LOT/UNIT </th>
                                                                <td className="das-report-display-data" colSpan={3} style={{ border: '1px solid black' }}>  {etservice.lotUnit}</td>
                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>BLOCK:</th>
                                                                <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}> {etservice.block}  </td>
                                                            </tr>

                                                            <tr>
                                                                <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>PROPERTY TYPE:</th>
                                                                <td className="das-report-display-data" colSpan={5} style={{ border: '1px solid black' }}>{etservice.propertyType} </td>
                                                                {/* <td colSpan={1} style={{ border: '1px solid black' }}></td>
                                                    <td colSpan={1}  style={{ border: '1px solid black' }}></td> */}
                                                            </tr>

                                                        </table>
                                                    </center>
                                                </div>
                                            )}
                                        </center>
                                    </div>
                                )}


                                <br />
                                <br />

                                {etservice && etservice.vestingdeedinfo.map((vestingdeedinfo, index) => (
                                    <div key={index} >
                                        <br />
                                        <center>
                                            <table className='das-display-table' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                                <tr>
                                                    <th className='das-display-header-table' colSpan="4"> {index === 0 ? "VESTING INFORMATION" : ` CHAIN OF TITLE  ${index}`}  </th>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> DEED TYPE </th>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{vestingdeedinfo.deedType}  </td>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> CONSIDERATION AMOUNT : $ </th>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>
                                                        {vestingdeedinfo.considerationAmount.startsWith('$')
                                                            ? vestingdeedinfo.considerationAmount
                                                            : `$${vestingdeedinfo.considerationAmount}`}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> GRANTOR : </th>
                                                    <td className="das-report-display-data" colSpan={3} style={{ border: '1px solid black' }}>{vestingdeedinfo.grantor}  </td>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>GRANTEE : </th>
                                                    <td className="das-report-display-data" colSpan={3} style={{ border: '1px solid black' }}>{vestingdeedinfo.grantee}</td>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> VESTING INFO :</th>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{vestingdeedinfo.vesting} </td>

                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>INSTR/BOOK/PAGE:</th>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{vestingdeedinfo.instaBookPage}  </td>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> DATED DATE: </th>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{moment(vestingdeedinfo.datedDate).format('MM/DD/YYYY')}  </td>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>RECORDED DATE:</th>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}> {moment(vestingdeedinfo.recorderdDate).format('MM/DD/YYYY')} </td>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>COMMENTS :</th>
                                                    <td className="das-report-display-data" colSpan={3} style={{ border: '1px solid black' }}>{vestingdeedinfo.comments}  </td>
                                                </tr>

                                            </table>
                                        </center>
                                    </div>
                                ))}
                                <br />
                                <br />
                                {etservice && etservice.absopenmortgagedeedinfo.map((openmortagedeedinfo, mIndex) => (
                                    <div key={mIndex + 1} >
                                        <br />
                                        <center>
                                            <table className='das-display-table' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >
                                                <tr>
                                                    <th className='das-display-header-table' colSpan={4} >OPEN MORTGAGE / DEED OF TRUST  - ({mIndex + 1}) INFORMATION </th>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> MORTGAGO </th>
                                                    <td className="das-report-display-data" colSpan={3} style={{ border: '1px solid black' }}>{openmortagedeedinfo.mortgagor}</td>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> MORTGAGEE </th>
                                                    <td className="das-report-display-data" colSpan={3} style={{ border: '1px solid black' }}>{openmortagedeedinfo.mortgagee}</td>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> TRUSTEE </th>
                                                    <td className="das-report-display-data" colSpan={3} style={{ border: '1px solid black' }}>{openmortagedeedinfo.trustee}</td>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> INSTRUMENT/BOOK/PAGE: </th>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{openmortagedeedinfo.instrBookPage}</td>

                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>AMOUNT [$]:</th>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>
                                                    {openmortagedeedinfo.amount.startsWith('$')
                                                            ? openmortagedeedinfo.amount
                                                            : `$${openmortagedeedinfo.amount}`}
                                                    </td>
                                                </tr>


                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> DATED DATE:  </th>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{moment(openmortagedeedinfo.datedDate).format('MM/DD/YYYY')}</td>

                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>RECORDED DATE:</th>

                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{moment(openmortagedeedinfo.recordedDate).format('MM/DD/YYYY')}</td>
                                                </tr>

                                                <tr>

                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>MATURITY DATE</th>
                                                    <td className="das-report-display-data" colSpan={3} style={{ border: '1px solid black' }}>{moment(openmortagedeedinfo.maturityDate).format('MM/DD/YYYY')}</td>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> MORTGAGE ASSIGNED TO </th>

                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{openmortagedeedinfo.mortgageAssignedTo}</td>

                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>ASSIGNMENT BK/PG </th>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{openmortagedeedinfo.assignmentBkPg}</td>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}> ASSIGNMENT DATED </th>

                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{moment(openmortagedeedinfo.assignmentDated).format('MM/DD/YYYY')}</td>

                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>ASSIGNMENT RECORDED: </th>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{moment(openmortagedeedinfo.assignmentRecorded).format('MM/DD/YYYY')}</td>
                                                </tr>

                                                <tr>
                                                    <th className="das-display-side-headings" colSpan={1} style={{ border: '1px solid black' }}>COMMENTS</th>
                                                    <td className="das-report-display-data" colSpan={3} style={{ border: '1px solid black' }}>{openmortagedeedinfo.comments === null ? "No Data" : openmortagedeedinfo.comments}</td>
                                                </tr>
                                            </table>
                                        </center>
                                    </div>
                                ))}
                                <br />
                            </div>
                        </div>
                        <br />
                        <br />

                        <div id="pdf-content2">
                            <br />
                            {/* <center>
                    <table className='das-display-report-heading' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                        <tr>  <th> DISCOVER ABSTRACT REPORT </th> </tr>
                    </table>
                </center> */}
                            <br />
                            <br />
                            <div >
                                <center>
                                    <table className='das-display-table' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th className='das-display-header-table' colSpan={4} style={{ marginBottom: '10px' }}> ACTIVE JUDGMENTS AND LIENS</th>
                                            </tr>
                                            <tr>
                                                <th className="das-display-sub-title-headings" colSpan={1} style={{ border: '1px solid black' }} scope="col">CASE TYPE</th>
                                                <th className="das-display-sub-title-headings" colSpan={1} style={{ border: '1px solid black' }} scope="col">BK&PG/CASE NO/INSTR NO</th>
                                                <th className="das-display-sub-title-headings" colSpan={1} style={{ border: '1px solid black' }} scope="col">RECORDING DATE</th>
                                                <th className="das-display-sub-title-headings" colSpan={1} style={{ border: '1px solid black' }} scope="col">AMOUNT</th>

                                                {/* <th className="mx-2" scope="col">Action</th>*/}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {etservice && etservice.absActiveJudgementsAndLines.map((activejudgmentsandliens, index) => (
                                                <tr key={index} style={{ border: '1px solid black' }}>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{activejudgmentsandliens.caseType}</td>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{activejudgmentsandliens.bkPgCaseNo}</td>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{moment(activejudgmentsandliens.recordingDate).format('MM/DD/YYYY')}</td>
                                                    <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>
                                                    {activejudgmentsandliens.amount.startsWith('$')
                                                            ? activejudgmentsandliens.amount
                                                            : `$${activejudgmentsandliens.amount}`}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </center>
                            </div>
                            <br />
                            {etservice && etservice.assessementsAndTaxInfo.map((taxinformation, tindex) => (
                                <div id="taxInformation" key={tindex}>
                                    <br />
                                    <center>
                                        <table className='das-display-table' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr>
                                                    <th className='das-display-header-table' colSpan={4}>TAX INFORMATION</th>
                                                </tr>
                                                <tr className='th-color'>
                                                    <th className="das-display-sub-title-headings" style={{ border: '1px solid black' }} colSpan={1}>ASSESMENT YEAR</th>
                                                    <td><center>{taxinformation.assementYear}</center></td>
                                                    <th className="das-display-sub-title-headings" style={{ border: '1px solid black' }} colSpan={1}>TAX YEAR</th>
                                                    <td><center>{taxinformation.selectedTaxYear}</center></td>
                                                </tr>
                                                {/* <tr>
                                                    <td className="das-report-display-data" style={{ border: '1px solid black' }} colSpan={2}>{taxinformation.assessmentYear}</td>
                                                    <td className="das-report-display-data" style={{ border: '1px solid black' }} colSpan={2}>{taxinformation.taxYear}</td>
                                                </tr> */}
                                            </thead>
                                            <tbody>
                                                <tr className='th-color'>
                                                    <th className="das-display-sub-title-headings" style={{ border: '1px solid black' }}>LAND VALUE</th>
                                                    <td className="das-report-display-data" style={{ border: '1px solid black' }} colSpan={1}>
                                                    {taxinformation.landValue.startsWith('$')
                                                            ? taxinformation.landValue
                                                            : `$${taxinformation.landValue}`}
                                                    </td>
                                                    <th className="das-display-sub-title-headings" style={{ border: '1px solid black' }}>BUILDING VALUE</th>
                                                    <td className="das-report-display-data" style={{ border: '1px solid black' }} colSpan={1}>
                                                    {taxinformation.buildingValue.startsWith('$')
                                                            ? taxinformation.buildingValue
                                                            : `$${taxinformation.buildingValue}`}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="das-display-sub-title-headings" style={{ border: '1px solid black' }}>TOTAL VALUE</th>
                                                    <td className="das-report-display-data" style={{ border: '1px solid black' }} colSpan={1}>
                                                    {taxinformation.totalValue.startsWith('$')
                                                            ? taxinformation.totalValue
                                                            : `$${taxinformation.totalValue}`}
                                                    </td>
                                                    <th className="das-display-sub-title-headings" style={{ border: '1px solid black' }}>EXTRA VALUE</th>
                                                    <td className="das-report-display-data" style={{ border: '1px solid black' }} colSpan={1}>
                                                    {taxinformation.extraValue.startsWith('$')
                                                            ?taxinformation.extraValue
                                                            : `$${taxinformation.extraValue}`}
                                                    </td>
                                                </tr>
                                                <tr className='th-color'>
                                                    <th className="das-display-sub-title-headings" style={{ border: '1px solid black' }}>INSTALLMENT</th>
                                                    <th className="das-display-sub-title-headings" style={{ border: '1px solid black' }}>AMOUNT</th>
                                                    <th className="das-display-sub-title-headings" style={{ border: '1px solid black' }}>STATUS</th>
                                                    <th className="das-display-sub-title-headings" style={{ border: '1px solid black' }}>PAID/DUE DATE</th>
                                                </tr>
                                                {etservice && etservice.taxinstallments.map((taxinstallments, tindex) => (
                                                    <tr key={tindex} className={tindex % 2 === 0 ? 'th-color' : ''}>
                                                        <td className="das-report-display-data" style={{ border: '1px solid black' }}>{taxinstallments.installment}</td>
                                                        <td className="das-report-display-data" style={{ border: '1px solid black' }}>
                                                        {/* {taxinstallments.amount} */}
                                                        {/* {taxinstallment.amount.startsWith('$')
                                                            ? taxinstallment.amount
                                                            : `$${taxinstallment.amount}`} */}
                                                            {taxinstallments.amount.startsWith('$')
                                                                ? taxinstallments.amount
                                                                : `$${taxinstallments.amount}`}
                                                        </td>
                                                        <td className="das-report-display-data" style={{ border: '1px solid black' }}>{taxinstallments.status}</td>
                                                        <td className="das-report-display-data" style={{ border: '1px solid black' }}>{moment(taxinstallments.paidDueDate).format('MM/DD/YYYY')}</td>
                                                    </tr>
                                                ))}
                                                <tr className='th-color'>
                                                    <th className="das-display-sub-title-headings" style={{ border: '1px solid black' }} colSpan={1}>COMMENTS</th>
                                                    <td className="das-report-display-data" style={{ border: '1px solid black' }} colSpan={3}>{taxinformation.comments}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </center>
                                </div>
                            ))}
                            <br />
                            <br />


                            <center>
                                <table className='das-display-table' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                    <tr >
                                        <th className='das-display-header-table' style={{ marginBottom: '10px' }} colSpan={5}> NAMES RUNS</th>
                                    </tr>
                                    <tr className='das-display-heading-table'>
                                        <th className="das-display-sub-title-headings" colSpan={1} style={{ border: '1px solid black' }}> NAME </th>
                                        <th className="das-display-sub-title-headings" colSpan={1} style={{ border: '1px solid black' }}>  JUD </th>
                                        <th className="das-display-sub-title-headings" colSpan={1} style={{ border: '1px solid black' }}> LINES </th>
                                        <th className="das-display-sub-title-headings" colSpan={1} style={{ border: '1px solid black' }}>UCC</th>
                                        <th className="das-display-sub-title-headings" colSpan={1} style={{ border: '1px solid black' }}>OTHERS</th>
                                    </tr>

                                    {etservice && etservice.namesrun.map((nameruns, nindex) => (
                                        <tr key={nindex}>
                                            <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{nameruns.name}</td>
                                            <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{nameruns.jud === null ? "X" : nameruns.jud}</td>
                                            <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{nameruns.liens === null ? "X" : nameruns.liens}</td>
                                            <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{nameruns.ucc === null ? "X" : nameruns.ucc}</td>
                                            <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>{nameruns.others === null ? "X" : nameruns.others}</td>
                                        </tr>
                                    ))}
                                </table>
                                <br />
                            </center>
                            {etservice && etservice.dasadditionalinformation.map((additionalinfo, tindex) => (
                                <div className='abstractreport-container-12'>
                                    <br />
                                    <center>
                                        <table className='das-display-table' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr>
                                                    <th className="das-display-header-table" colSpan='7'>ADDITIONAL INFORMATION</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td colSpan='7' style={{ width: '100%', border: '1px solid black' }}>
                                                        {additionalinfo.additionalInformation || "No additional information available"}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </center>
                                </div>
                            ))}
                            <br />
                            {etservice && (
                                <center>
                                    <table className='das-display-table' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                                        <tr>
                                            <th className="das-display-header-table" colSpan={1}> SHORT LEGAL DESCRIPTION </th>
                                        </tr>

                                        <tr>
                                            <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>
                                                <p>FOR COMPLETE LEGAL DESCRIPTION SEE ATTACHED VESTING DEED </p>
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <p> PROPERTY ADDRESS :  {etservice.propertyAddress} </p>
                                                {/* {etservice.propertyAddress === null ? "No" : {etservice.propertyAddress}}  */}
                                            </td>

                                        </tr>


                                    </table>
                                </center>
                            )}
                        </div>
                        <br />
                        <br />


                        <div id="pdf-content3">
                            {/* Third set of content to be converted */}

                            <br />
                            {/* <center>
                    <table className='das-display-report-heading' style={{ border: '2px solid black', borderCollapse: 'collapse' }}>
                        <tr>
                            <th>  DISCOVER ABSTRACT REPORT   </th>
                        </tr>
                    </table>
                </center> */}

                            <br />
                            <br />
                            {etservice && (
                                <div className='abstractreport-container-13'>
                                    <br />

                                </div>
                            )}
                            <br />
                            <br />

                            <center>
                                <table className='das-display-table' style={{ border: '2px solid black', borderCollapse: 'collapse' }} >

                                    <tr>
                                        <th className='das-display-header-table' style={{ marginBottom: '10px' }} colSpan={1}>DISCLAIMER</th>
                                    </tr>

                                    <tr>
                                        <td className="das-report-display-data" colSpan={1} style={{ border: '1px solid black' }}>This title search report was performed in accordance with generally accepted standards. This report may not contain information
                                            affecting above real estate property that cannot be indexed due to different spelling of owner's name or incorrectly recorded
                                            parcel number or recorder clerk error. Taxes are informational purposes only, all information contained herein are obtained
                                            from Tax collectors office/website. Please do check for any additional levies and assessments before settlement. We makes no
                                            warranties, and assumes no liability whatsoever for the accuracy of the information contained herein beyond the exercise of
                                            such reasonable care.</td>
                                    </tr>

                                </table>
                            </center>
                            <br />
                        </div>


                        <div className='abstractform-button-container'>
                            <center>
                                <button className='das-service-display-pdf-button ' onClick={printDocument}>Download PDF</button>
                                <button className='das-service-display-doc-button' onClick={handleDownload}>Download DOCX</button>

                                <button className='das-service-display-doc-button' onClick={editReport}>EditReport</button>
                            </center>


                            {/* <button className='abstractform-button' onClick={generateWordDocument}>Download word</button> */}
                        </div>

                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}



export default DasDisplay
