import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GeckoTerminalChart = ({ fromToken }) => {
  const [poolAddress, setPoolAddress] = useState('Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE'); // Default SOL pool
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch new pool address if it's not the default SOL token
    const fetchPoolAddress = async (tokenAddress) => {
      // If no token provided or it's the SOL address, use default pool
      if (!tokenAddress || tokenAddress === 'So11111111111111111111111111111111111111112') {
        setPoolAddress('Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `https://api.geckoterminal.com/api/v2/networks/solana/tokens/${tokenAddress}/pools?page=1`,
          {
            headers: {
              'Accept': 'application/json',
            }
          }
        );

        if (response.data?.data?.[0]?.attributes?.address) {
          setPoolAddress(response.data.data[0].attributes.address);
        } else {
          setError('No pool found for this token');
        }
      } catch (err) {
        console.error('Error fetching pool address:', err);
        setError('Failed to fetch pool data');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if fromToken is provided and is not SOL's address
    if (fromToken && fromToken !== 'So11111111111111111111111111111111111111112') {
      fetchPoolAddress(fromToken);
    }
  }, [fromToken]);

  if (loading) {
    return (
      <div className="msg-container">
        <div className="message">Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="msg-container">
        <div className="message error">{error}</div>
      </div>
    );
  }

  if (!poolAddress) {
    return (
      <div className="msg-container">
        <div className="message error">No chart available</div>
      </div>
    );
  }

  return (
    <iframe
      height="100%"
      width="100%"
      id="geckoterminal-embed"
      title="GeckoTerminal Embed"
      src={`https://www.geckoterminal.com/solana/pools/${poolAddress}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0`}
      frameBorder="0"
      allow="clipboard-write"
      allowFullScreen
    />
  );
};

export default GeckoTerminalChart;