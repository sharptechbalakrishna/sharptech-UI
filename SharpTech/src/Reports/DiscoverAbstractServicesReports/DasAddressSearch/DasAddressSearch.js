import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import './DasAddressSearch.css';
import Footer from '../../../components/Footer/Footer';
import Navbar from '../../../components/Navbar/Navbar';

const loadCSS = (href) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load CSS file: ${href}`));
    document.head.appendChild(link);
  });
};

function DasAddressSearch() {
  const [partialAddress, setPartialAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css')
      .then(() => console.log('Font Awesome CSS loaded successfully'))
      .catch((error) => console.error('Error loading Font Awesome CSS:', error));
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (partialAddress && partialAddress.length > 2) {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8080/partial/Addresssearch/${partialAddress.toLowerCase()}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (Array.isArray(response.data)) {
            setSuggestions(response.data);
          } else {
            console.error('Fetched data is not an array:', response.data);
            setSuggestions([]);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(debounceFetch);
  }, [partialAddress]);

  const handleAddressChange = (event) => {
    setPartialAddress(event.target.value);
    setSelectedAddress(null);
  };

  const handleSuggestionClick = (e) => {
    const address = JSON.parse(e.target.value);
    setSelectedAddress(address);
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
      
      <form className="address-search-form" onSubmit={handleSubmit}>
      <h1 className="address-search-heading">DAS Address Search</h1>
        <div className="address-search-input-wrapper">

          <i className="fas fa-search address-search-icon"></i>
          <input
            className="address-search-input"
            type="text"
            placeholder="Search Address"
            value={partialAddress}
            onChange={handleAddressChange}
          />
        </div>
        {suggestions.length > 0 && partialAddress.length > 2 && (
          <div className="address-search-suggestions">
            <select
              className="address-search-suggestions-select"
              onChange={handleSuggestionClick}
            >
              <option value="">Select Address</option>
              {suggestions.map((address) => (
                <option key={address.orderNumber} value={JSON.stringify(address)}>
                  {address.propertyAddress} (Order Number: {address.orderNumber})
                </option>
              ))}
            </select>
          </div>
        )}
        <button className="address-search-submit-button" type="submit" disabled={loading}>
          {loading ? <ProgressSpinner style={{ width: '24px', height: '24px' }} strokeWidth="4" /> : 'Search'}
        </button>
        {selectedAddress && (
        <div className="address-search-result">
          <p><strong>Selected Address:</strong> {selectedAddress.propertyAddress}</p>
          <p><strong>Order Number:</strong> {selectedAddress.orderNumber}</p>
        </div>
      )}
      </form>
    
    </div>
    <Footer/>
    </div>
  );
}

export default DasAddressSearch;
