import { useNavigate } from "react-router-dom";
function Home() {
    const navigate = useNavigate();
    return (
        <div className="form-container2">
            <div>
                <img src="/eth_logo.png" alt="" />
                <h1>Welcome into <span>ETH </span>Wallet</h1>
            </div>
            <h4>ETH Wallet is a simple Ethereum wallet that allows you to create accounts and transfer Ether.</h4>
            <p>Click on the <span className="nav-link" onClick={() => navigate('/register')}>Register</span> to create a new Wallet.</p>
            <p>Click on the <span className="nav-link" onClick={() => navigate('/login')}>Login</span> to log and enter to your existing Wallet.</p>
        </div>
    );
}

export default Home;