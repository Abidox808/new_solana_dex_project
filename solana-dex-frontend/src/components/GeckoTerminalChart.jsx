import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GeckoTerminalChart = ({ fromToken }) => {
  // Initialize with SOL pool address and no loading state
  const [poolAddress, setPoolAddress] = useState('Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip the API call if fromToken is empty/null/undefined
    if (!fromToken) {
      return;
    }

    // Skip the API call if it's the default SOL token
    if (fromToken === 'So11111111111111111111111111111111111111112') {
      setPoolAddress('Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE');
      return;
    }

    const fetchPoolAddress = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `https://api.geckoterminal.com/api/v2/networks/solana/tokens/${fromToken}/pools?page=1`,
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
          // Fallback to SOL pool if no pool found
          setPoolAddress('Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE');
        }
      } catch (err) {
        console.error('Error fetching pool address:', err);
        setError('Failed to fetch pool data');
        // Fallback to SOL pool on error
        setPoolAddress('Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if it's not SOL and not empty
    fetchPoolAddress();
  }, [fromToken]);

  if (loading) {
    return (
      <div className="msg-container">
        <div className="message">Loading chart...</div>
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