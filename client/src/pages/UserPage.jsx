import { useEffect, useState } from "react";
import { getUser } from "../services/fetching";
import { useNavigate } from "react-router-dom";
import { Web3 } from 'web3';

import '../styles/User.css';
import AddressCard from '../components/AddressCard';

function UserPage() {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const web3 = new Web3('http://localhost:7545');
    
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUser(res.user);
        setAccounts(res.accounts);
        setTransactions(res.transactions);

        await Promise.all(res.accounts.map(async account => {
          const balance = await web3.eth.getBalance(account.address);
          setBalances(prevBalances => [...prevBalances, web3.utils.fromWei(balance, 'ether')]);
        }));

      } catch (error) {
        setError(error.message);
      }
    }
    fetchUser();
  }, []);

  const transactionsFromAccount = (address) => {
    const tran = transactions.filter(transaction => transaction.sender_address === address);
    return tran.map(transaction => transaction.receiver_address).filter((value, index, self) => self.indexOf(value) === index);
  }

  return (
    <div className="user-container">
      
      <div className="form-container">
        {error ? <div className="form-error">{error}</div> 
        :<>
          <h1>Welcome {user?.first_name} {user?.last_name}</h1>
          <button className="form-button" onClick={() => navigate("/create-account")}>Create new account</button>
        </>}
      </div>

      {accounts.map((account, index) => (
        <AddressCard key={index} name={account.name} address={account.address} balance={balances[index]} setBalances={setBalances} transactions={transactionsFromAccount(account.address)} />
      ))}
    </div>
  );
}

export default UserPage;