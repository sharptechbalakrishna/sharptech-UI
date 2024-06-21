import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DasAddressSearch.css'; // Ensure you have the CSS file for styling
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';

function DasAddressSearch() {
  const [partialAddress, setPartialAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (partialAddress.length > 2) {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8080/search/${partialAddress}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setSuggestions(response.data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [partialAddress]);

  const handleAddressChange = (event) => {
    setPartialAddress(event.target.value);
  };

  const handleSuggestionClick = (address) => {
    setSelectedAddress(address);
    setPartialAddress(address.address); // Update input with full address
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAddress) {
      navigate(`/DasDisplay/${selectedAddress.orderNumber}`);
    } else {
      alert('Please select an address');
    }
  };

  return (
    <div>
    <Navbar/>
    <div className="address-search-container">
      <h1 className="address-search-heading">DAS Address Search</h1>
      <form className="address-search-form" onSubmit={handleSubmit}>
        <div className="address-search-input-wrapper">
          <input
            className="address-search-input"
            type="text"
            placeholder="Search Address"
            value={partialAddress}
            onChange={handleAddressChange}
          />
          {suggestions.length > 0 && (
            <div className="address-search-suggestions">
              {suggestions.map((address, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(address)}
                >
                  {address.address} (Order Number: {address.orderNumber})
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="order-info-box">
          {selectedAddress ? (
            <div className="order-details">
              <p><strong>Address:</strong> {selectedAddress.address}</p>
              <p><strong>Order Number:</strong> {selectedAddress.orderNumber}</p>
            </div>
          ) : (
            <p>No address selected.</p>
          )}
        </div>
        <button className="address-search-submit-button" type="submit">
          Search
        </button>
      </form>
    </div>
    <Footer/>
    </div>
  );
}

export default DasAddressSearch;
