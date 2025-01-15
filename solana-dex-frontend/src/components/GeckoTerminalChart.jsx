import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GeckoTerminalChart = ({ fromToken, toToken }) => {
  const [poolAddress, setPoolAddress] = useState('');
  const [loading, setLoading] = useState(false);  // Changed to false initially
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // SOL token address
  const SOL_ADDRESS = 'So11111111111111111111111111111111111111112';

  useEffect(() => {
    const fetchPoolAddress = async (tokenAddress) => {
      if (!tokenAddress) return;  // Don't fetch if no address

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
          setInitialized(true);
        } else {
          setError('No pool found for this token');
        }
      } catch (err) {
        console.error('Error fetching pool address:', err);
        // Don't set error for initial SOL fetch
        if (tokenAddress !== SOL_ADDRESS || initialized) {
          setError('Failed to fetch pool data');
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a fromToken or we haven't initialized yet
    if (fromToken || !initialized) {
      const tokenToFetch = fromToken || SOL_ADDRESS;
      fetchPoolAddress(tokenToFetch);
    }
  }, [fromToken, initialized]); // Added initialized to dependencies

  // Show nothing while waiting for initial token list
  if (!initialized && !fromToken) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Initializing chart...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (!poolAddress) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Select a token to view chart</div>
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