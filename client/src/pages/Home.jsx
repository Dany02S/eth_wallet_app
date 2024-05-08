import { useNavigate } from "react-router-dom";
function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <img src="../../public/eth_logo.png" alt="" />
            <h1>Welcome into <span>ETH </span>Wallet</h1>
            <h4>ETH Wallet is a simple Ethereum wallet that allows you to create accounts and transfer Ether.</h4>
            <p>Click on the <span className="nav-link" onClick={() => navigate('/register')}>Register</span> link in the navigation bar to create an user account.</p>
            <p>Click on the <span className="nav-link" onClick={() => navigate('/login')}>Login</span> link in the navigation bar to log in to your user account.</p>
        </div>
    );
}

export default Home;