import { useEffect, useState } from "react";
import { getUser } from "../services/fetching";
import { useNavigate } from "react-router-dom";
import { Web3 } from 'web3';

import '../styles/User.css';
import AddressCard from '../components/AddressCard';

function UserPage() {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [balances, setBalances] = useState([]);
  const navigate = useNavigate();
  const web3 = new Web3('http://localhost:7545');

  useEffect(() => {
    const token = localStorage.getItem('token');
    getUser(token)
      .then(response => {
        setUser(response);
        const balancePromises = response.addresses.map(address => getBalance(address.address));
        Promise.all(balancePromises)
          .then(balances => setBalances(balances))
          .catch(error => setError(error.message));
      })
      .catch(error => {
        setError(error.message);
      });    
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

      {user?.addresses.map((address, index) => (
        <AddressCard address={address} balance={balances[index]} key={index} />
      ))}
    </div>
  );
}

export default UserPage;