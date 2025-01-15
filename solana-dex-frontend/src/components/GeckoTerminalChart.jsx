import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GeckoTerminalChart = ({ fromToken, toToken }) => {
  const [poolAddress, setPoolAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SOL token address
  const SOL_ADDRESS = 'So11111111111111111111111111111111111111112';

  useEffect(() => {
    const fetchPoolAddress = async (tokenAddress) => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `https://api.geckoterminal.com/api/v2/networks/solana/tokens/${tokenAddress}/pools?page=1`
        );

        if (response.data?.data?.[0]?.attributes?.address) {
          setPoolAddress(response.data.data[0].attributes.address);
        } else {
          setError('No pool found for this token');
        }
      } catch (err) {
        setError('Failed to fetch pool data');
        console.error('Error fetching pool address:', err);
      } finally {
        setLoading(false);
      }
    };

    // If no token is selected, use SOL as default
    const tokenToFetch = fromToken || SOL_ADDRESS;
    fetchPoolAddress(tokenToFetch);
  }, [fromToken]); // Only depend on fromToken

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
        <div className="text-lg">No chart available</div>
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