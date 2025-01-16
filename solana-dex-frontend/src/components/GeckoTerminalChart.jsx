import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GeckoTerminalChart = ({ fromToken }) => {
  const [poolAddress, setPoolAddress] = useState('424kbbJyt6VkSn7GeKT9Vh5yetuTR1sbeyoya2nmBJpw'); // Default SOL pool
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip fetching if no token is provided (show default SOL chart)
    // or if the token is SOL (already showing SOL chart)
    if (!fromToken || fromToken === 'So11111111111111111111111111111111111111112') {
      return;
    }

    const fetchPoolAddress = async (tokenAddress) => {
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
          // Fallback to SOL chart if no pool found
          setPoolAddress('424kbbJyt6VkSn7GeKT9Vh5yetuTR1sbeyoya2nmBJpw');
        }
      } catch (err) {
        console.error('Error fetching pool address:', err);
        setError('Failed to fetch pool data');
        // Fallback to SOL chart on error
        setPoolAddress('424kbbJyt6VkSn7GeKT9Vh5yetuTR1sbeyoya2nmBJpw');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a non-SOL token
    if (typeof fromToken === 'string' && fromToken.length > 0) {
      fetchPoolAddress(fromToken);
    }
  }, [fromToken]);

  // Always render iframe, show loading overlay if needed
  return (
    <div className="relative w-full h-full">
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
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-lg">Loading chart...</div>
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
};

export default GeckoTerminalChart;