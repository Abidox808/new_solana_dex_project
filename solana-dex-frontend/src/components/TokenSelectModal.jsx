import React, { useState } from 'react';
import '../styles/token-select-modal.css';

const TokenSelectModal = ({ isOpen, tokens, onSelectToken, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  const filteredTokens = tokens.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Select Token</h2>
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by name or paste address" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="token-list">
          {filteredTokens.map((token) => (
            <div 
              key={token.address} 
              className="token-item" 
              onClick={() => {
                onSelectToken(token);
                onClose();
              }}
            >
              <img src={token.logoURI} alt={token.symbol} className="token-image" />
              <div className="token-info">
                <span className="token-symbol">{token.symbol}</span>
                <span className="token-name">{token.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenSelectModal;