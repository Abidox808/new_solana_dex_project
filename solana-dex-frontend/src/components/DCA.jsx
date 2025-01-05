import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import { useWallet } from '@solana/wallet-adapter-react';
import '../styles/dca.css';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
import {DCA as MyDCA, Network } from '@jup-ag/dca-sdk';
import { connection } from '../config';
import BN from 'bn.js';

const DCA = () => {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState(0);
  const [frequency, setFrequency] = useState('60');
  const [interval, setInterval] = useState(1);
  const [numOrders, setNumOrders] = useState(1);
  const [orderStatus, setOrderStatus] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [solToUsdc, setSolToUsdc] = useState(0);
  const wallet = useWallet();
  const [inputMintToken, setInputMintToken] = useState('');
  const [outputMintToken, setOutputMintToken] = useState('');
  const [inputTokenPrice, setInputTokenPrice] = useState('');
  const [iframeSrc, setIframeSrc] = useState('https://birdeye.so/tv-widget/So11111111111111111111111111111111111111112/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=CANDLE&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark');

  const [orderWarning, setOrderWarning] = useState('');
  const [amountWarning, setAmountWarning] = useState('');

  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000';
  
  const fetchInputTokenPrice = async (mintAddress) => {
    try {
      const response = await axios.get(`https://api.jup.ag/price/v2?ids=${mintAddress}`);
      const priceData = response.data.data[mintAddress];
      if (priceData) {
        setInputTokenPrice(priceData.price);
      } else {
        console.error('Price data not found for mint address:', mintAddress);
      }
    } catch (error) {
      console.error('Error fetching input token price:', error);
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tokens`);
        const tokenData = response.data;
        setTokens(tokenData);

        const fromTokenData = tokenData.find(token => token.symbol === fromToken);
        const toTokenData = tokenData.find(token => token.symbol === toToken);

        if (fromTokenData && toTokenData) {
          setInputMintToken(fromTokenData.address);
          setOutputMintToken(toTokenData.address);
          fetchInputTokenPrice(fromTokenData.address);

          // Update iframe source
          setIframeSrc(`https://birdeye.so/tv-widget/${fromTokenData.address}/${toTokenData.address}?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=CANDLE&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark`);

          
        }

      } catch (error) {
        console.error('Error fetching tokens:', error);
        setOrderStatus('Failed to fetch tokens');
      }
    };

    fetchTokens();
  }, [fromToken, toToken, API_BASE_URL]);

  useEffect(() => {
    if (inputMintToken && outputMintToken) {
      setIframeSrc(`https://birdeye.so/tv-widget/${inputMintToken}/${outputMintToken}?chain=solana&viewMode=base%2Fquote&chartInterval=1D&chartType=CANDLE&chartTimezone=America%2FLos_Angeles&chartLeftToolbar=show&theme=dark`);
    }
  }, [inputMintToken, outputMintToken]);

  useEffect(() => {
    if (numOrders < 2) {
      setOrderWarning('Number of orders cannot be less than 2.');
    } else {
      setOrderWarning('');
    }
  }, [numOrders]);
  
  useEffect(() => {
    if (inputTokenPrice && amount && numOrders >= 0.01) {
      const amountNumber = parseFloat(amount);
      const priceNumber = parseFloat(inputTokenPrice);
      const orderValue = amountNumber * priceNumber;
      console.log('orderValue:', orderValue);
      if (orderValue < 100) {
        setAmountWarning('Order value must be at least $100.');
      } else {
        setAmountWarning('');
      }
    }
  }, [inputTokenPrice, amount, numOrders]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset warnings
    setOrderWarning('');
    setAmountWarning('');

    // Check number of orders
    if (numOrders < 2) {
      setOrderWarning('Number of orders cannot be less than 2.');
      return;
    }

    // Check if amount and numOrders are valid numbers
    const amountNumber = parseFloat(amount);
    const numOrdersNumber = parseFloat(numOrders);
    if (isNaN(amountNumber) || isNaN(numOrdersNumber)) {
      setAmountWarning('Invalid amount or number of orders.');
      return;
    }

    // Check order value
    const priceNumber = parseFloat(inputTokenPrice);
    const orderValue = amountNumber * priceNumber;
    console.log('inputTokenPrice:', inputTokenPrice);
    console.log('amount:', amount);
    console.log('numOrders:', numOrders);
    if (orderValue < 100) {
      setAmountWarning('order Value must be at least $100.');
      return;
    }

    if (!wallet.connected || !wallet.publicKey) {
      console.error('Wallet is not connected.');
      setOrderStatus('Wallet is not connected. Please connect your wallet.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/dca-order`, {
        fromToken,
        toToken,
        publicKey: wallet.publicKey.toString(),
        amount,
        frequency,
        interval,
        numOrders,
      });
  
      const dca = new MyDCA(connection, Network.MAINNET);
    
      // Calculate amounts using BN instead of BigInt
      const inputDecimal = res.data.orderResult.inputDecimal;
      const totalAmount = parseFloat(amount);
      // Calculate base amounts
      const baseAmountPerCycle = (totalAmount / numOrders);
      const amountPerCycleRaw = Math.floor(baseAmountPerCycle * Math.pow(10, inputDecimal));

      // Add a small buffer to the total amount (0.01 more than exact amount)
      const slightlyHigherTotal = totalAmount + 0.01;
      const totalAmountRaw = Math.floor(slightlyHigherTotal * Math.pow(10, inputDecimal));

      const amountPerCycle = new BN(amountPerCycleRaw.toString());
      const totalAmountInSmallestUnit = new BN(totalAmountRaw.toString());

      console.log({
        inputDecimal,
        baseAmountPerCycle,
        amountPerCycleRaw,
        totalAmountRaw,
        amountPerCycleBN: amountPerCycle.toString(),
        totalAmountBN: totalAmountInSmallestUnit.toString()
      });

    // Create PublicKeys for input and output mints
    const inputMint = new PublicKey(res.data.orderResult.inputMint);
    const outputMint = new PublicKey(res.data.orderResult.outputMint);
    
    // Generate timestamp for PDA and applicationIdx
    const timestamp = new BN(Math.floor(Date.now() / 1000));

    // Generate DCA PDA
    const [dcaPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("dca"),
        wallet.publicKey.toBuffer(),
        inputMint.toBuffer(),
        outputMint.toBuffer(),
        timestamp.toArrayLike(Buffer, "le", 8),
      ],
      new PublicKey("DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M")
    );

    // Get user's input token ATA
    const userAta = getAssociatedTokenAddressSync(
      inputMint,
      wallet.publicKey
    );

    // Get DCA's associated token accounts
    const inAta = getAssociatedTokenAddressSync(
      inputMint,
      dcaPDA,
      true // allowOwnerOffCurve = true for PDAs
    );

    const outAta = getAssociatedTokenAddressSync(
      outputMint,
      dcaPDA,
      true // allowOwnerOffCurve = true for PDAs
    );

    const cycleFrequency = new BN(parseInt(frequency) * parseInt(interval));

    // Required accounts structure from documentation
    const accounts = {
      dca: dcaPDA,
      user: wallet.publicKey,
      payer: wallet.publicKey,
      inputMint,
      outputMint,
      userAta,
      inAta,
      outAta,
      systemProgram: new PublicKey("11111111111111111111111111111111"),
      tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
      eventAuthority: new PublicKey("Cspp27eGUDMXxPEdhmEXFVRn6Lt1L7xJyALF3nmnWoBj"),
      program: new PublicKey("DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M")
    };

    console.log('Amount per cycle:', amountPerCycle.toString());
    console.log('Total amount:', totalAmountInSmallestUnit.toString());

    const params = {
      payer: wallet.publicKey,
      user: wallet.publicKey,
      inAmount: 101000000,
      inAmountPerCycle: 50500000,
      cycleSecondsApart: cycleFrequency,
      inputMint: new PublicKey(res.data.orderResult.inputMint),
      outputMint: new PublicKey(res.data.orderResult.outputMint),
      minOutAmountPerCycle: null,
      maxOutAmountPerCycle: null,
      startAt: null,
      userInTokenAccount: userAta,
    };
    console.log('Sending DCA parameters:', params);
    console.log('Debug values:', {
      inAmount: totalAmountInSmallestUnit.toString(),
      inAmountPerCycle: amountPerCycle.toString(),
      cycleSecondsApart: cycleFrequency.toString(),
      inputMint: inputMint.toString(),
      outputMint: outputMint.toString(),
      userInTokenAccount: userAta.toString()
    })

    // Create DCA
    const { tx } = await dca.createDcaV2(params);
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    const txid = await wallet.sendTransaction(tx, connection);
    setOrderStatus(`Transaction sent. Confirming...`);

      await connection.confirmTransaction({
        signature: txid,
        blockhash: tx.recentBlockhash,
        lastValidBlockHeight: lastValidBlockHeight,
      });
      setOrderStatus(`DCA order placed successfully. Transaction ID: ${txid}`);
    } catch (error) {
      console.error('Error placing DCA order:', error);
      setOrderStatus('Failed to place DCA order. Please try again.');
    }
  };

  const handleSelectToken = (token, type) => {
    if (type === 'from') {
      setFromToken(token);
      setShowFromDropdown(false);
    } else {
      setToToken(token);
      setShowToDropdown(false);
    }
  };

  const equivalentUsdc = solToUsdc ? (amount * solToUsdc).toFixed(2) : '0.00';

  return (
    <div className='dca-page'>
      <div className='dca-page-section'>
        <iframe 
          title='DCA Trading IFrame'
          width="100%" 
          height="600" 
          src={iframeSrc}>
        </iframe>
      </div>
      <div className="dca-page-chart">
        {orderStatus && <p>{orderStatus}</p>}
        <form onSubmit={handleSubmit}>
        {orderWarning && <p className="warning">{orderWarning}</p>}
        {amountWarning && <p className="warning">{amountWarning}</p>}
          <div className="form-group">
            <label htmlFor="from-token">I Want To Allocate</label>
            <div className="inline-fields">
              <Dropdown
                tokens={tokens}
                selectedToken={fromToken}
                onSelectToken={(token) => handleSelectToken(token, 'from')}
                showDropdown={showFromDropdown}
                setShowDropdown={setShowFromDropdown}
                style={{ width: '200px' }}
              />
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.2"
                required
                style={{ marginLeft: '10px', width: '100px', padding: '10px', marginTop: '10px' }}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="to-token">To buy</label>
            <Dropdown
              tokens={tokens}
              selectedToken={toToken}
              onSelectToken={(token) => handleSelectToken(token, 'to')}
              showDropdown={showToDropdown}
              setShowDropdown={setShowToDropdown}
              style={{ width: '200px' }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="interval">Every</label>
            <div className="inline-fields">
              <input
                type="number"
                id="interval"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                required
                style={{ marginRight: '10px', width: '50px', color: 'white' }}
              />
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
                style={{ width: '100px' }}
              >
                <option value="60">Minute</option>
                <option value="3600">Hour</option>
                <option value="86400">Day</option>
                <option value="604800">Week</option>
                <option value="77760000">Month</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="num-orders">Over</label>
            <div className="inline-fields">
              <input
                type="number"
                id="num-orders"
                value={numOrders}
                onChange={(e) => setNumOrders(e.target.value)}
                required
                style={{ marginRight: '10px', width: '50px', color: 'white' }}
              />
              <span>orders</span>
            </div>
          </div>
          <button type="submit">Start DCA</button>
        </form>
      </div>
    </div>
  );
};

export default DCA;
