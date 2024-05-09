import { useEffect, useState } from "react";
import { getUser } from "../services/fetching";
import { useNavigate } from "react-router-dom";


import '../styles/User.css';
import AddressCard from '../components/AddressCard';


function UserPage() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [balanceChange, setBalanceChange] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUser(res.user);
        setAccounts(res.accounts);
        setTransactions(res.transactions);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchUser();
  }, [balanceChange]);


  return (
    <div className="user-container">
      
      <div className="form-container">
        {error ? <div className="form-error">{error}</div> 
        :<>
          <h1>Welcome {user?.first_name} {user?.last_name}</h1>
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
        />
      ))}</>

      
    </div>
  );
}

export default UserPage;