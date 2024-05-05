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
  const navigate = useNavigate();
  const web3 = new Web3('http://localhost:7545');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUser(response.user);
        
        const accounts = response.accounts;
        for (let i = 0; i < accounts.length; i++) {
          accounts[i].balance = await getBalance(accounts[i].address);
        }
        setAccounts(response.accounts);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchUser();
  }, []);

  const getBalance = async (address) => {
    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, 'ether');
  }

  return (
    <div className="user-container">
      <div className="form-container">
        <h1>Welcome {user?.first_name} {user?.last_name}</h1>
        {error && <div className="form-error">{error}</div>}
        {!error && <button className="form-button" onClick={() => navigate("/create-address")}>Create Address</button>}
      </div>

      {accounts.map((account, index) => (
        <AddressCard key={index} name={account.name} address={account.address} balance={account.balance} />
      ))}
    </div>
  );
}

export default UserPage;