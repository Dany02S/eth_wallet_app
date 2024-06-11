import { useEffect, useState } from "react";
import { getUser, change2FA } from "../services/fetching";
import { useNavigate } from "react-router-dom";

import AddressCard from '../components/AddressCard';
import LiveChart from "../components/user_card/LiveChart";
import BalanceInfo from "../components/user_card/BalanceInfo";
import AIChat from "../components/user_card/AIChat";

import { getEthereumPrice } from "../services/fetching";
import {Web3} from 'web3';
import { Switch } from "@mui/material";

import '../styles/User.css';
import '../styles/AIChat.css';
import LiveNews from "../components/user_card/LiveNews";
import useEthereumPrices from '../hooks/useEthereumPrices';

function UserPage() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [twoFactor, setTwoFactor] = useState(false);

  const [error, setError] = useState(null);
  const [balanceChange, setBalanceChange] = useState(false);

  const [totalBalance, setTotalBalance] = useState(0);
  const [dollar, setDollar] = useState(null);
  

  const [nav, setNav] = useState(0);
  const navigate = useNavigate();
  const web3 = new Web3(import.meta.env.VITE_WEB3_PROVIDER_URL);
  // eslint-disable-next-line no-unused-vars
  const dollarPrices = useEthereumPrices();

  const fetchBalances = async () => {
    let sum = 0;
    for (let account of accounts) {
      const balance = await web3.eth.getBalance(account.address);
      sum += parseFloat(web3.utils.fromWei(balance, 'ether'));
    }
    setTotalBalance(sum);
  }
  
  const fetchUser = async () => {
    try {
      const res = await getUser();
      setUser(res.user);
      setAccounts(res.accounts);
      setTwoFactor(res.user.two_factor);
      setTransactions(res.transactions.reverse());

      const dollarPrice = await getEthereumPrice();
      setDollar(dollarPrice.USD);

      fetchBalances();

    } catch (error) {
      setError(error.message);
    }
  }

  const handleTwoFactorChange = async () => {
    try {
      await change2FA(!twoFactor);
      setTwoFactor(!twoFactor);
      if (!twoFactor) {
        navigate("/twofactor", { state: { twoFactor: twoFactor } });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const filterTransactions = (address) => {
    return transactions.filter(transaction => transaction.sender_address === address || transaction.receiver_address === address);
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    fetchUser();
  }, [dollar, balanceChange, twoFactor]);

  return (
    <div className="user-container">
      
      <div className="form-container">
        <div className="user-navbar">
          <div className="user-page-menu">
            <img src="user.png" alt="" onClick={() => setNav(0)} />
            <img src="chart.png" alt="" onClick={() => setNav(1)} />
            <img src="newspaper.png" alt="" onClick={() => setNav(2)} />
            <img src="gemini.png" id="gemini-logo" alt="" onClick={() => setNav(3)} />
          </div>
          <div className="twofa-switch">
            <p className="nav-text" style={{color: twoFactor ? "green" : "gray"}}>2FA</p>
            <Switch className="form-switch" onChange={handleTwoFactorChange} color="default" checked={twoFactor} />
          </div>
        </div>
        {error 
        ? <div className="form-error">{error}</div> 
        : nav === 0
        ? <BalanceInfo user={user} totalBalance={totalBalance} dollar={dollar} navigate={navigate} />
        : nav === 1
        ? <LiveChart dollar={dollar} />
        : nav === 2
        ? <LiveNews />
        : nav === 3
        ? <AIChat />
        : null
        }
      </div>

      <>{accounts.map((account, index) => (
        <AddressCard 
          key={index} 
          name={account.name} 
          address={account.address}
          transactions={filterTransactions(account.address)} 
          balanceChange={balanceChange}
          setBalanceChange={setBalanceChange}
          setTotalBalance={setTotalBalance}
          dollar={dollar}
          web3={web3}
        />
      ))}</>

    </div>
  );
}

export default UserPage;