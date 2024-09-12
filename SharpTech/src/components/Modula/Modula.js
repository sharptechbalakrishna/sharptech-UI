import React from 'react';
import './Modula.css';
import modulaimg from '../../assets/Update.jpg';
import moment from 'moment';
import { FaTimes } from 'react-icons/fa';  // Import the close icon

const Modula = ({ onClose, UpdateData }) => {
    return (
        <>
            <div className="modula_backdrop" onClick={onClose}></div>
            <div className='modula_container'>
                <div className="modula_content">
                    {/* <button className="modula_close" onClick={onClose}>
                        <FaTimes />
                    </button> */}
                    <div className="modula_image">
                        <img src={modulaimg} alt="Newsletter" />
                    </div>
                    <div className="modula_table">
                        {UpdateData && UpdateData.updatesList && UpdateData.updatesList.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Release Date</th>
                                        <th>URL</th>
                                    </tr>
                                </thead>
                                {UpdateData.updatesList.map((data, index) => (
                                    <tbody key={index}>
                                        <tr>
                                            <td>{data.title}</td>
                                            <td>{data.description}</td>
                                            <td>{moment(data.releaseDate).format('MM-DD-YYYY')}</td>
                                            <td><a href={data.url} target="_blank" rel="noopener noreferrer" className="link-text">
                                                Link
                                            </a></td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        ) : (
                            <p>No updates available.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modula;
