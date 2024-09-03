import React from 'react';
import './Modal.css'; // Ensure this path matches your file structure
import { FaTimes } from 'react-icons/fa'; // Import a cross icon from react-icons
import moment from 'moment';

const Modal = ({ onClose, UpdateData }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Future Software</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="scrollable">
          {UpdateData && UpdateData.updatesList && UpdateData.updatesList.length > 0 ? (
            <table className="updates-table">
              <thead>
                <tr>
                 
                  <th>Title</th>
                  <th>Description</th>
                  <th>Created By</th>
                  <th>Release Date</th>
                  <th>url</th>
                </tr>
              </thead>
              <tbody>
                {UpdateData.updatesList.map((data, index) => (
                  <tr key={index}>
              
                    <td>{data.title}</td>
                    <td>{data.description}</td>
                    <td>{data.createdBy}</td>
                    <td>{moment(data.releaseDate).format('MM-DD-YYYY')}</td>
                    <td><a href={data.url} target="_blank" rel="noopener noreferrer" className="link-text">
                       Link
                      </a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No updates available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
