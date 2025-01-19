import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GeckoTerminalChart = ({ fromToken }) => {
  const SOL_POOL_ADDRESS = 'Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE';
  const [poolAddress, setPoolAddress] = useState(SOL_POOL_ADDRESS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPoolAddress = async (tokenAddress) => {
      setLoading(true);
      try {
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
          setPoolAddress(SOL_POOL_ADDRESS);
        }
      } catch (err) {
        setPoolAddress(SOL_POOL_ADDRESS);
      } finally {
        setLoading(false);
      }
    };

    if (fromToken && 
        fromToken !== 'So11111111111111111111111111111111111111112' && 
        fromToken.length > 0) {
      fetchPoolAddress(fromToken);
    } else {
      setPoolAddress(SOL_POOL_ADDRESS);
    }
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