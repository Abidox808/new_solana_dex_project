import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaSync } from 'react-icons/fa';
import { FaRedoAlt } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import Dropdown from './Dropdown';
import AmountInput from './AmountInput';
import SwapButton from './SwapButton';
import Slippage from './Slippage';
import PriceDisplay from './PriceDisplay';
import SlippageModal from './SlippageModal';
import '../styles/token-swap.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction, Connection ,PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import toggle from '../images/toggle.png';
import { connection } from '../config';
import TokenSelectModal from './TokenSelectModal';
import { PhantomWalletName } from '@solana/wallet-adapter-wallets';

const TokenSwap = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [fromTokenAddress, setFromTokenAddress] = useState('So11111111111111111111111111111111111111112');
  const [toTokenAddress, setToTokenAddress] = useState('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
  const [Decimals, setDecimals] = useState('');
  const [fromTokenDecimals, setFromTokenDecimals] = useState(9);
  const [toTokenDecimals, setToTokenDecimals] = useState(6);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState('');
  const [slippage, setSlippage] = useState(0.5); // default slippage tolerance
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);
  const [fromBalance, setFromBalance] = useState('0'); // Example balance
  const [toBalance, setToBalance] = useState('0'); // Example balance
  const [isTokenSelectModalOpen, setIsTokenSelectModalOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState('from'); // 'from' or 'to'
  const wallet = useWallet();
  const priceRefreshInterval = useRef(null);
  const [debouncedFromAmount, setDebouncedFromAmount] = useState(fromAmount);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSlippageManual, setIsSlippageManual] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000';
  const END_POINT = import.meta.env.VITE_APP_RPC_END_POINT || 'https://api.mainnet-beta.solana.com';
  const WRAPPED_SOL_ADDRESS = 'So11111111111111111111111111111111111111112';

  const handleConnectWallet = async () => {
    try {
      if (!wallet.connected) {
        await wallet.select(PhantomWalletName);
        await wallet.connect();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setTransactionStatus('Failed to connect wallet. Please try again.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFromAmount(fromAmount);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [fromAmount]);

  useEffect(() => {
    const savedTokens = localStorage.getItem('selectedTokens');
    if (savedTokens) {
      const { from, to, fromTokenAddress, toTokenAddress } = JSON.parse(savedTokens);
      setFromToken(from);
      setToToken(to);
      setFromTokenAddress(fromTokenAddress);
      setToTokenAddress(toTokenAddress);
    }
  }, []);

  useEffect(() => {
    if (fromToken && toToken) {
      localStorage.setItem('selectedTokens', JSON.stringify({
        from: fromToken,
        to: toToken,
        fromTokenAddress: fromTokenAddress,
        toTokenAddress: toTokenAddress
      }));
    }
  }, [fromToken, toToken]);

  const handleAmountChange = async (value) => {
    setFromAmount(value);
    if (value && fromToken && toToken && tokens.length > 0) {
      const token1 = tokens.find(t => t.symbol === fromToken);
      const token2 = tokens.find(t => t.symbol === toToken);
      const tokenIds = [token1?.address, token2?.address].filter(Boolean);
      await fetchPrices(tokenIds);
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tokens`);
        const tokenData = response.data;
  
        if (!Array.isArray(tokenData)) {
          throw new Error('Expected an array of tokens but received something else');
        }
  
        setTokens(tokenData);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setError('Failed to fetch tokens');
      }
    };
  
    fetchTokens();
  }, [API_BASE_URL]);

  const fetchTokenBalance = async (tokenAddress, walletAddress) => {
    try {
      const connection = new Connection(END_POINT); 
      const publicKey = new PublicKey(walletAddress);

    // If the token is native SOL, fetch the native balance
    if (tokenAddress === WRAPPED_SOL_ADDRESS) {
      const balance = await connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    }

    // For SPL tokens, fetch the token balance
    const tokenPublicKey = new PublicKey(tokenAddress);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });

    const tokenAccount = tokenAccounts.value.find(account => 
      account.account.data.parsed.info.mint === tokenPublicKey.toBase58()
    );

    if (tokenAccount) {
      return tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
};

const fetchPrices = async (tokenIds) => {
  setIsRefreshing(true);
  setError(null);
  try {
    setToAmount('');
    const jupiterResponse = await axios.get(`https://api.jup.ag/price/v2?ids=${tokenIds.join(',')}`);
    
    // Extract prices from the response
    const newPrices = {};
    for (const tokenId of tokenIds) {
      const token = tokens.find(t => t.address === tokenId);
      newPrices[token.symbol] = jupiterResponse.data.data[tokenId]?.price || 'Price not available';
    }

    setPrices(newPrices);
    
    // Update toAmount with new prices
    if (fromAmount && newPrices[fromToken] && newPrices[toToken]) {
      const fromPrice = newPrices[fromToken];
      const toPrice = newPrices[toToken];
      const convertedAmount = (fromAmount * fromPrice / toPrice).toFixed(10);
      setToAmount(convertedAmount);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    return newPrices;
  } catch (error) {
    console.error('Error fetching prices from Jupiter API:', error);
    setError('Failed to fetch prices');
    return null;
  } finally {
    setTimeout(() => {
        setIsRefreshing(false);
      }, 2000);
  }
  };

  useEffect(() => {
    const startPriceRefresh = () => {
      if (fromToken && toToken && tokens.length > 0) {
        const token1 = tokens.find(t => t.symbol === fromToken);
        const token2 = tokens.find(t => t.symbol === toToken);
        const tokenIds = [token1?.address, token2?.address].filter(Boolean);

        if (priceRefreshInterval.current) {
          clearInterval(priceRefreshInterval.current);
        }

        // Initial fetch
        if (debouncedFromAmount) {
          fetchPrices(tokenIds);
        }

        // Set up interval for background refresh
        priceRefreshInterval.current = setInterval(() => {
          if (debouncedFromAmount) {
            fetchPrices(tokenIds);
          }
        }, 12000); // 12 seconds
      }
    };

    startPriceRefresh();

    return () => {
      if (priceRefreshInterval.current) {
        clearInterval(priceRefreshInterval.current);
      }
    };
  }, [fromToken, toToken, tokens, debouncedFromAmount]);

  const fetchBalance = async () => {
    if (fromTokenAddress && wallet.publicKey) {
      const balance = await fetchTokenBalance(fromTokenAddress, wallet.publicKey.toBase58());
      setFromBalance(balance);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [fromTokenAddress, wallet.publicKey]);

  useEffect(() => {
    if (fromToken && toToken && tokens.length > 0) {
      const token1 = tokens.find(t => t.symbol === fromToken);
      const token2 = tokens.find(t => t.symbol === toToken);
      fetchPrices([token1? token1.address : null, token2? token2.address : null]);

    }
  }, [fromToken, toToken, tokens]);

  useEffect(() => {
    if (fromAmount && prices[fromToken] && prices[toToken]) {
      const fromPrice = prices[fromToken];
      const toPrice = prices[toToken];
      const convertedAmount = (fromAmount * fromPrice / toPrice).toFixed(10);
      setToAmount(convertedAmount);
    } else {
      setToAmount('');
    }
  }, [fromAmount, prices, fromToken, toToken]);

  const handleSelectToken = async (token, type) => {
    if (token) {
      if (type === 'from') {
        setFromToken(token.symbol);
        setFromTokenAddress(token.address);
        setFromTokenDecimals(token.decimals); 
      } else {
        setToToken(token.symbol);
        setToTokenAddress(token.address);
        setToTokenDecimals(token.decimals); 
      }
    }
    setIsTokenSelectModalOpen(false);
  };

  const openTokenSelectModal = (type) => {
    setSelectingFor(type);
    setIsTokenSelectModalOpen(true);
  };

  const handleFlip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromTokenAddress(toTokenAddress);
    setToTokenAddress(fromTokenAddress);
    setFromTokenDecimals(toTokenDecimals); 
    setToTokenDecimals(fromTokenDecimals);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = async () => {
    if (!wallet.connected) {
      await handleConnectWallet();
      return; 
    }
    
    setTransactionStatus('Initiating transaction...');
    const walletAddress = wallet.publicKey;
  
    try {
      if (!fromTokenAddress || !toTokenAddress || !fromTokenDecimals) {
        throw new Error('Token information is missing. Please reselect the tokens.');
      }
      
      const payload = {
        fromToken: fromTokenAddress,
        toToken: toTokenAddress,
        decimals: fromTokenDecimals,
        fromAmount,
        toAmount,
        slippage,
        walletAddress: walletAddress.toString(),
        platformFeeBps: 50,
      };
      console.log('Swap Payload:', payload);
  
      const res = await axios.post(`${API_BASE_URL}/api/swap`, payload);
      console.log('Swap Response:', res.data);
  
      setTransactionStatus(<span style={{ color: 'white', fontWeight: 300 }}>Signing transaction...</span>);
      const swapTransaction = res.data.swapResult;
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const signTransaction = await wallet.signTransaction(transaction);
      setTransactionStatus(<span style={{ color: 'white', fontWeight: 300 }}>Sending signed transaction to Solana Network</span>);
      const latestBlockhash = await connection.getLatestBlockhash();
      const txid = await connection.sendRawTransaction(signTransaction.serialize());
  
      setTransactionStatus(<span style={{ color: 'white', fontWeight: 300 }}>Confirming ...</span>);
      await connection.confirmTransaction({
        blockhash: latestBlockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: txid,
      });
  
      setTimeout(() => {
        setTransactionStatus(
        <a style={{ color: 'white', fontWeight: 600, textDecoration: 'underline' }}
        href={`https://solscan.io/tx/${txid}`} target="_blank" rel="noopener noreferrer">
        Transaction succeeded! Click here to view on Solscan
        </a>
        );
        fetchBalance();
        handleRefresh();
      }, 15000);
      handleRefresh();
      console.log(`https://solscan.io/tx/${txid}`);
    } catch (error) {
      console.error('Error during transaction:', error);
      setTransactionStatus('Transaction failed. Please try again.');
    }
  };

  const handleRefresh = async () => {
    if (fromToken && toToken && tokens.length > 0) {
      const token1 = tokens.find(t => t.symbol === fromToken);
      const token2 = tokens.find(t => t.symbol === toToken);
      const tokenIds = [token1?.address, token2?.address].filter(Boolean);
      await fetchPrices(tokenIds);
    }
    fetchBalance();
  };

  const handleHalf = () => {
    if (fromBalance) {
      const halfBalance = (parseFloat(fromBalance) / 2).toString();
      setFromAmount(halfBalance); // Update the input field with half the balance
    }
  };
  
  const handleMax = () => {
    if (fromBalance) {
      setFromAmount(fromBalance.toString()); // Update the input field with the full balance
    }
  };

  const handleSlippageToggle = () => {
    setIsSlippageManual((prevState) => !prevState);
    if (!isSlippageManual) {
      setIsSlippageModalOpen(true);
    }
  };

  return (
    <div className="token-swap-container">
      <div className='token-swap-body'>
        <div className="token-swap">
          {loading && <p>Loading...</p>}
          {transactionStatus && <p>{transactionStatus}</p>}
          <div className="token-swap-inputs">
          <div className="slippage-container">
                  <div className="slippage-info">
                    <span className="slippage-value">
                      {isSlippageManual ? `${slippage}%` : 'Dynamic'}
                    </span>
                    <button
                      className={`slippage-toggle ${isSlippageManual ? 'manual' : 'dynamic'}`}
                      onClick={handleSlippageToggle}
                    >
                      <FaGear className="info-icon" />
                    </button>
                  </div>
                </div>
            <div className="token-swap-input">
              <label>You're Selling:</label>
              <div className="balance-info">
              <span>Balance: {fromBalance} {fromToken}</span>
              <div className="balance-actions">
                <button onClick={handleHalf} className="balance-btn">
                  <i className="fas fa-divide"></i> Half
                </button>
                <button onClick={handleMax} className="balance-btn">
                  <i className="fas fa-arrow-up"></i> Max
                </button>
                <button 
                onClick={handleRefresh} 
                className={`balance-btn refresh-button ${isRefreshing ? 'refreshing' : ''}`}
                disabled={isRefreshing}
              >
                <FaRedoAlt className="refresh-icon" />
              </button>
              </div>
            </div>
              <div className="input-group">
              <button 
                  className="token-select-button dropdown-selected" 
                  onClick={() => {
                    setSelectingFor('from');
                    setIsTokenSelectModalOpen(true);
                  }}
                >
                  {fromToken ? (
                    <>
                      <img 
                        src={tokens.find(t => t.symbol === fromToken)?.logoURI} 
                        className="token-icon"
                      />
                      <span>{fromToken}</span>
                    </>
                  ) : (
                    'Select Token'
                  )}
                  <span className="dropdown-arrow">▼</span>
                </button>
                <AmountInput
                  value={fromAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.0"
                />
              </div>
            </div>
            <div className="flip-button-container">
              {/* <SwapButton onClick={handleFlip} /> */}
              <div onClick={handleFlip}>
                <img src={toggle}/>
              </div> 
            </div>
            <div className="token-swap-input">
              <label>You're Buying:</label>
              <div className="input-group">
              <button 
                  className="token-select-button" 
                  onClick={() => {
                    setSelectingFor('to');
                    setIsTokenSelectModalOpen(true);
                  }}
                >
                  {toToken ? (
                    <>
                      <img 
                        src={tokens.find(t => t.symbol === toToken)?.logoURI} 
                        className="token-icon"
                      />
                      <span>{toToken}</span>
                    </>
                  ) : (
                    'Select Token'
                  )}
                  <span className="dropdown-arrow">▼</span>
                </button>
                <AmountInput
                  value={toAmount}
                  readOnly
                  placeholder="0.0"
                />
              </div>
            </div>
            </div>
          <div className='handle-swap-btn'>
            <button onClick={handleSwap}>
              {wallet.connected ? 'Swap' : 'Connect Wallet'}
            </button>
          </div>
          <SlippageModal
            isOpen={isSlippageModalOpen}
            onRequestClose={() => setIsSlippageModalOpen(false)}
            slippage={slippage}
            setSlippage={setSlippage}
          />
          <TokenSelectModal
            isOpen={isTokenSelectModalOpen}
            tokens={tokens}
            onSelectToken={(token) => handleSelectToken(token, selectingFor)}
            onClose={() => setIsTokenSelectModalOpen(false)}
          />
          <PriceDisplay fromToken={fromToken} toToken={toToken} prices={prices} />
        </div>
      </div>
    </div>
  );
};

export default TokenSwap;
