import React, { useState } from 'react';

const Dropdown = ({ tokens, selectedToken, onSelectToken, showDropdown, setShowDropdown }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={() => setShowDropdown(!showDropdown)}>
        {selectedToken}
      </div>
      {showDropdown && (
        <div className="dropdown-list">
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredTokens.map(token => (
            <div
              key={token.address}
              className="dropdown-item"
              onClick={() => {
                onSelectToken(token.symbol);
                setShowDropdown(false);
              }}
            >
              <img src={token.logoURI} alt={token.symbol} className="token-logo" />
              <span>{token.symbol}</span>
              <span>{token.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;