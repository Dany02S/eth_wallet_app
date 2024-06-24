import { useNavigate } from "react-router-dom";
function Home() {
    const navigate = useNavigate();
    return (
        <div className="form-container2">
            <div>
                <img src="/logo.png" className="home_logo" alt="" />
                <h1>Welcome into <span>ETH</span>na</h1>
            </div>
            <h4>ETHna is a simple and secure crypto wallet that allows you to create accounts and transfer Ether.</h4>
            <p>Click on <span className="nav-link" onClick={() => navigate('/register')}>Register</span> to create a new Wallet.</p>
            <p>Click on <span className="nav-link" onClick={() => navigate('/login')}>Login</span> to enter into your existing Wallet.</p>
        </div>
    );
}

export default Home;