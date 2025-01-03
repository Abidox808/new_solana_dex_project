import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const TradingChart = ({ tokenPair, inputMintToken, outputMintToken }) => {
  const chartContainerRef = useRef(null); // Ref for the chart container
  const chartRef = useRef(null); // Ref for the chart instance
  const candlestickSeriesRef = useRef(null); // Ref for the candlestick series
  const [isConnected, setIsConnected] = useState(false); // State for WebSocket connection status

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize the chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: '#1a1a1a' }, // Dark background
        textColor: '#d1d4dc', // Light text color
      },
      grid: {
        vertLines: { color: '#2B2B43' }, // Vertical grid lines
        horzLines: { color: '#2B2B43' }, // Horizontal grid lines
      },
      width: chartContainerRef.current.clientWidth, // Full width of the container
      height: 400, // Fixed height
    });

    // Add a candlestick series to the chart
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a', // Green for upward candles
      downColor: '#ef5350', // Red for downward candles
      borderVisible: false, // No borders
      wickUpColor: '#26a69a', // Green for upward wicks
      wickDownColor: '#ef5350', // Red for downward wicks
    });

    // Store references to the chart and candlestick series
    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Connect to Birdeye WebSocket for real-time data
    const ws = new WebSocket(`wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR_API_KEY`);

    ws.onopen = () => {
      console.log('WebSocket connection opened.');
      setIsConnected(true);

      // Subscribe to price updates for the selected token pair
      const subscriptionMsg = {
        type: 'SUBSCRIBE_PRICE',
        data: {
          chartType: '1m', // 1-minute candles
          currency: 'pair',
          address: inputMintToken, // Use inputMintToken for the pair
        },
      };
      ws.send(JSON.stringify(subscriptionMsg));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket data:', data);

      // Update the chart with new data
      if (data.type === 'PRICE_UPDATE') {
        const newCandle = {
          time: Math.floor(Date.now() / 1000), // Current timestamp in seconds
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
        };
        candlestickSeriesRef.current.update(newCandle);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed.');
      setIsConnected(false);
    };

    // Handle window resize to adjust chart width
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize); // Remove resize listener
      ws.close(); // Close WebSocket connection
      if (chartRef.current) {
        chartRef.current.remove(); // Remove the chart instance
      }
    };
  }, [inputMintToken, outputMintToken]); // Re-run effect if inputMintToken or outputMintToken changes

  return (
    <div className="w-full h-[400px] bg-[#1a1a1a] rounded-lg">
      {/* Chart container */}
      <div ref={chartContainerRef} className="w-full h-full" />
      {/* Display connection status */}
      {!isConnected && <p className="text-center text-red-500">Connecting to WebSocket...</p>}
    </div>
  );
};

export default TradingChart;