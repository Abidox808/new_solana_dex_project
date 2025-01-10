require('dotenv').config();

const {MongoClient} = require('mongodb');
const express = require('express');
const cors = require('cors');
const { Keypair, PublicKey } = require('@solana/web3.js');
const { combineAndDeduplicateData,  placePerpsOrder } = require('./services/tokenService');
const axios = require('axios');



// Load keypair from environment variables
let keypairData;
try {
    keypairData = JSON.parse(process.env.MY_DEX_PROJECT_PRIVATE_KEY);
} catch (error) {
    //console.error('Invalid JSON format for MY_DEX_PROJECT_PRIVATE_KEY:', error.message);
    process.exit(1);
}

const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));

const app = express();
const PORT = process.env.PORT || 3000;

const client = new MongoClient(process.env.MONGO_CONNECTION_STRING);
client.connect();
console.log('db connected');
const database = client.db('solana_dex');

const fetchMintAddressFromJupiter = async (symbol) => {
  try {
    const response = await axios.get('https://tokens.jup.ag/tokens?tags=verified');
    const token = response.data.find(t => t.symbol === symbol);

    if (!token) {
      throw new Error(`Token ${symbol} not found in Jupiter API`);
    }

    return { address: token.address, decimal: token.decimals };
  } catch (error) {
    console.error('Error fetching token from Jupiter API:', error);
    throw new Error('Failed to fetch token from Jupiter API');
  }
};


app.use(cors());
app.use(express.json());

app.get('/api/tokens', async (req, res) => {
  try {
    const tokens = await combineAndDeduplicateData();
    res.json(tokens);
  } catch (error) {
    //console.error('Error fetching tokens:', error);
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

const performSwap = async (fromToken, toToken, decimals, fromAmount, toAmount, slippage, walletAddress, platformFeeBps) => {
  try {
    const inputMint = fromToken;
    const decimal = decimals;
    const outputMint = toToken;

    // Fetch the quote with platform fee
    const quoteResponse = await axios.get(process.env.JUPITER_SWAP_QUOTE_API_URL, {
      params: {
        inputMint: inputMint,
        outputMint: outputMint,
        amount: fromAmount * Math.pow(10, decimal),
        slippageBps: slippage * 100,
        platformFeeBps: platformFeeBps, // Add platform fee in basis points
      }
    });

    const quoteRes = quoteResponse.data;
    console.log('Jupiter API Response:', quoteRes);

    // Validate the feeMint before creating a PublicKey
    if (!feeMint || typeof feeMint !== 'string') {
      throw new Error('Invalid fee mint address');
    }

    // Find the fee account
    const [feeAccount] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("referral_ata"),
        new PublicKey(process.env.REFERRAL_ACCOUNT_PUBKEY).toBuffer(),
        new PublicKey(feeMint).toBuffer(),
      ],
      new PublicKey("REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3")
    );

    // Perform the swap with the fee account
    const swapTransaction = await axios.post(process.env.JUPITER_SWAP_API_URL, {
      quoteResponse: quoteRes,
      userPublicKey: walletAddress,
      wrapAndUnwrapSol: true,
      feeAccount: feeAccount.toBase58(), // Add fee account
    });

    const swapResult = swapTransaction.data.swapTransaction;
    console.log('Swap Result:', swapResult);
    return swapResult;
  } catch (error) {
    console.error('Error in performSwap:', error);
    throw new Error(`Swap execution failed: ${error.message}`);
  }
};

app.post('/api/swap', async (req, res) => {
  try {
    const { fromToken, toToken, decimals, fromAmount, toAmount, slippage, walletAddress, platformFeeBps } = req.body;

    if (!fromToken || !toToken || !fromAmount || !decimals || !toAmount || !slippage || !walletAddress || !platformFeeBps) {
      return res.status(400).json({ message: 'Invalid input parameters' });
    }

    const swapResult = await performSwap(fromToken, toToken, decimals, fromAmount, toAmount, slippage, walletAddress, platformFeeBps);

    res.json({ message: 'Swap successful', swapResult });
  } catch (error) {
    console.error('Error during swap:', error);
    res.status(500).json({ error: 'Swap failed', details: error.message });
  }
});

async function placeLimitOrder(fromToken, toToken, price, FromTokenAmount, walletAddress, ToTokenAmount, sendingBase) {
  try {
    // Fetch mint addresses and decimals for the tokens
    const fromTokenData = await fetchMintAddressFromJupiter(fromToken);
    const fromMint = fromTokenData.address;
    const fromDecimal = fromTokenData.decimal;

    const toTokenData = await fetchMintAddressFromJupiter(toToken);
    const toMint = toTokenData.address;
    const toDecimal = toTokenData.decimal;

    console.log('SOL Decimals:', fromDecimal);
    console.log('USDC Decimals:', toDecimal);

    console.log('totalFromAmount:', ToTokenAmount);
    console.log('FromTokenAmount:', FromTokenAmount);

    // Calculate amounts in lamports (smallest units of the tokens)
    const makingAmount = Math.round(FromTokenAmount * Math.pow(10, fromDecimal)); // Amount of the "from" token
    const takingAmount = Math.round(ToTokenAmount * Math.pow(10, toDecimal)); // Amount of the "to" token

    // Log the calculated amounts for debugging
    console.log('Making Amount (lamports):', makingAmount);
    console.log('Taking Amount (lamports):', takingAmount);

    // Create the request body for the Jupiter Limit Order v2 API
    const createOrderBody = {
      inputMint: fromMint, // Mint address of the "from" token (SOL)
      outputMint: toMint, // Mint address of the "to" token (USDC)
      maker: walletAddress, // Wallet address of the maker
      payer: walletAddress, // Wallet address of the payer
      params: {
        makingAmount: makingAmount.toString(), // Amount of the "from" token in lamports
        takingAmount: takingAmount.toString(), // Amount of the "to" token in lamports
        expiredAt: undefined, // Optional: Set an expiry date for the order
      },
      computeUnitPrice: "auto", // Use "auto" for priority fee
      wrapAndUnwrapSol: true, // Optional: Wrap/unwrap SOL if needed
    };

    // Log the request body for debugging
    console.log('Request Body:', createOrderBody);

    // Send the request to the Jupiter Limit Order v2 API
    const response = await axios.post(`${process.env.JUPITER_LIMIT_ORDER_API_URL}createOrder`, createOrderBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return the transaction data
    return response.data;
  } catch (error) {
    console.error('Error in placeLimitOrder:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    throw new Error('Limit order placement failed');
  }
}

app.post('/api/limit-order-history', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    const openOrdersResponse = await axios.get(`https://api.jup.ag/limit/v2/openOrders?wallet=${walletAddress}`);
    const orderHistoryResponse = await axios.get(`https://api.jup.ag/limit/v2/orderHistory?wallet=${walletAddress}`);

    const fetchResult = {
      openOrders: openOrdersResponse.data,
      orderHistory: orderHistoryResponse.data,
    };

    res.json({ message: 'Open order fetched successfully', fetchResult });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ error: 'Failed to fetch order history', details: error.message });
  }
});

app.post('/api/limit-order', async (req, res) => {
  try {
    const { fromToken, toToken, price, amount, walletAddress, totalUSDC, sendingBase } = req.body;

    const orderResult = await placeLimitOrder(fromToken, toToken, price, amount, walletAddress, totalUSDC, sendingBase);

    res.json({ message: 'Limit order placed successfully', orderResult });
  } catch (error) {
    console.error('Error placing limit order:', error);
    res.status(500).json({ error: 'Failed to place limit order', details: error.message });
  }
});

async function placeDCAOrder(fromToken, toToken) {
  try {
    const fromTokenData = await fetchMintAddressFromJupiter(fromToken);
    const toTokenData = await fetchMintAddressFromJupiter(toToken);

    return {
      inputMint: fromTokenData.address,
      inputDecimal: fromTokenData.decimal,
      outputMint: toTokenData.address,
      outputDecimal: toTokenData.decimal,
    };
  } catch (error) {
    console.error('Error in placeDCAOrder:', error);
    throw new Error('DCA order placement failed');
  }
}

app.post('/api/dca-order', async (req, res) => {
  try {
    const { fromToken, toToken } = req.body;

    const orderData = await placeDCAOrder(fromToken, toToken);

    res.json({
      message: 'DCA order data fetched successfully',
      orderResult: orderData,
    });
  } catch (error) {
    console.error('Error fetching DCA order data:', error);
    res.status(500).json({ error: 'Failed to fetch DCA order data', details: error.message });
  }
});

app.post('/api/perps-order', async (req, res) => {
  try {
    const { fromToken, toToken, price, amount, position, leverage } = req.body;

    const orderResult = await placePerpsOrder(fromToken, toToken, price, amount, position, leverage);
    
    res.json({ message: 'Perps order placed successfully', orderResult });
  } catch (error) {
    ////console.error('Error placing Perps order:', error);
    res.status(500).json({ error: 'Failed to place Perps order', details: error.message });
  }
});

// app.get('/api/all-tokens', async (req, res) => {
//   const veriviedTokens = await getMintAddress()
// });

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  //console.log(`Server running at http://localhost:${PORT}`);
});

