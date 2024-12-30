import React, { useRef, useEffect, useState } from 'react';
import '../styles/dropdown.css';

const Dropdown = ({ tokens, selectedToken, onSelectToken, showDropdown, setShowDropdown }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowDropdown]);

  // Filter tokens based on search term
  const filteredTokens = tokens.filter((token) =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Limit to top 100 tokens if no search term is entered
  const displayedTokens = searchTerm ? filteredTokens : filteredTokens.slice(0, 100);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="dropdown-selected" onClick={() => setShowDropdown(!showDropdown)}>
        {selectedToken || 'Select Token'}
      </div>
      {showDropdown && (
        <div className="dropdown-menu">
          <input
            type="text"
            placeholder="Search by token or paste address"
            className="dropdown-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="dropdown-items">
            {displayedTokens.map((token) => (
              <div
                key={token.address}
                className="dropdown-item"
                onClick={() => {
                  onSelectToken(token.symbol);
                  setShowDropdown(false);
                }}
              >
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  className="token-logo"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/20'; // Fallback image
                  }}
                />
                <span>{token.symbol}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;