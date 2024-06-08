import { useEffect, useState } from "react";
import { getUser, change2FA } from "../services/fetching";
import { useNavigate } from "react-router-dom";
import { getEthereumPrice } from "../services/fetching";

import '../styles/User.css';
import AddressCard from '../components/AddressCard';
import {Web3} from 'web3';
import { Switch } from "@mui/material";


function UserPage() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [twoFactor, setTwoFactor] = useState(false);

  const [error, setError] = useState(null);
  const [balanceChange, setBalanceChange] = useState(false);

  const [totalBalance, setTotalBalance] = useState(0);
  const [dollar, setDollar] = useState(null);

  const navigate = useNavigate();
  const web3 = new Web3(import.meta.env.VITE_WEB3_PROVIDER_URL);

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

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    fetchUser();
  }, [dollar, balanceChange]);

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

  

  return (
    <div className="user-container">
      
      <div className="form-container">
        <div className="twofa-switch">
          <p className="nav-text" style={{color: twoFactor ? "green" : "gray"}}>2FA</p>
          <Switch className="form-switch" onChange={handleTwoFactorChange} color="default" checked={twoFactor} />
        </div>
        {error ? <div className="form-error">{error}</div> 
        :<>
          <h1 className="user-data-show">Welcome {user?.first_name} {user?.last_name}</h1>
          <h2 className="user-data-show">{parseFloat(totalBalance).toFixed(6)} ETH</h2>
          <h3 className="user-data-show" id="real-price">{parseFloat(dollar*totalBalance).toFixed(2)}$</h3>
          <div className="form-buttons">
            <button className="form-button" onClick={() => navigate("/create-account")}>Create new account</button>
          </div>
        </>}
      </div>

      <>{accounts.map((account, index) => (
        <AddressCard 
          key={index} 
          name={account.name} 
          address={account.address}
          transactions={transactions} 
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