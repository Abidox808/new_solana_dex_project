const { Connection } = require('@solana/web3.js');
const { Token } = require('../models/mintTokenModel');
// const { getMinimumBalanceForRentExemptAccountWithExtensions } = require('@solana/spl-token'); 
// (Remove if unused)
const fetchModule = import('node-fetch');

async function fetchWithRetry(url, options = {}, retries = 3) {
  const fetch = (await fetchModule).default;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Fetching ${url}`);
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log(`Successfully fetched data from ${url}`);
      return data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === retries) {
        console.error(`Failed to fetch ${url} after ${retries} attempts:`, error);
        throw error;
      }
      console.log(`Retrying fetch ${url} (attempt ${attempt + 1})...`);
    }
  }
}

async function fetchFromBirdeye() {
  // Replace with your actual API key if required by BirdEye
  const apiKey = '7707fff5284b4debbdc6487845ea9218';
  const headers = {
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json'
  };
  
  const data = await fetchWithRetry('https://public-api.birdeye.so/defi/tokenlist', { headers });
  console.log('Birdeye Token Data:', data);
  
  if (!data || !data.data || !Array.isArray(data.data.tokens)) {
    console.error('Invalid data from BirdEye API:', data);
    throw new Error('Failed to fetch valid data from BirdEye API');
  }
  
  console.log('BirdEye Data:', data);
  return data.data.tokens;
}

async function fetchFromSolanaBlockchain() {
  const connection = new Connection('https://api.devnet.solana.com');
  // Implement your logic to fetch tokens from the Solana blockchain
  const tokens = []; 
  return tokens;
}

const jupiterAxios = axios.create({
  headers: {
    'referer': 'https://newsolanadexproject-production.up.railway.app',
  }
});

async function fetchJupiterTokens() {
  try {
    const response = await jupiterAxios.get('https://tokens.jup.ag/tokens?tags=verified');
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format from Jupiter API');
    }
    return response.data;
  } catch (error) {
    console.error('Jupiter API error:', error.response || error);
    throw new Error(`Failed to fetch Jupiter tokens: ${error.message}`);
  }
}

async function getTokenInfo(mintAddress) {
  try {
    const response = await jupiterAxios.get(`https://tokens.jup.ag/token/${mintAddress}`);
    return response.data;
  } catch (error) {
    console.error('Token info error:', error.response || error);
    throw new Error(`Failed to fetch token info: ${error.message}`);
  }
}

async function combineAndDeduplicateData() {
  try {
    const tokens = await fetchJupiterTokens();
    return tokens.map(token => ({
      address: token.address,
      symbol: token.symbol,
      decimals: token.decimals,
      name: token.name,
      logoURI: token.logoURI
    }));
  } catch (error) {
    console.error('Token combination error:', error);
    throw error;
  }
}

// Define the placeDCAOrder function with necessary parameters
async function placeDCAOrder(fromToken, toToken, amount, frequency, interval, numOrders) {
  try {
    // Simulate the DCA order placement
    const dcaOrderResult = {
      fromToken,
      toToken,
      amount,
      frequency,
      interval,
      numOrders,
      timestamp: new Date(),
    };
    // Add actual DCA logic if needed
    return dcaOrderResult;
  } catch (error) {
    console.error('Error in placeDCAOrder:', error);
    throw new Error('DCA order placement failed');
  }
}

// Define the placePerpsOrder function with necessary parameters
async function placePerpsOrder(fromToken, toToken, price, amount, position, leverage) {
  try {
    const perpsOrderResult = {
      fromToken,
      toToken,
      price,
      amount,
      position,
      leverage,
      timestamp: new Date(),
    };
    // Add actual Perps order logic if needed
    return perpsOrderResult;
  } catch (error) {
    console.error('Error in placePerpsOrder:', error);
    throw new Error('Perps order placement failed');
  }
}

exports.getTokenBySymbol = async (symbol) => {
  return Token.findOne({ symbol });
};

module.exports = { combineAndDeduplicateData, getTokenInfo ,placeDCAOrder, placePerpsOrder };
