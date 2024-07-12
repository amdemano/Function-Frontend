import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [message, setMessage] = useState("");
  

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
      setMessage(`Deposited 1 ETH successfully!`);
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
      setMessage(`Withdrew 1 ETH successfully!`);
    }
  }

  const burn = async () => {
    if (atm) {
      let tx = await atm.burn(1);
      await tx.wait();
      getBalance();
      setMessage(`Burned 1 ETH successfully!`);
    }
  }

  const mint = async () => {
    if (atm) {
      let tx = await atm.mint(1); // Mint the specified amount
      await tx.wait();
      getBalance();
      setMessage(`Minted 1 ETH successfully!`);
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div className="content">
        <div className="info-box">
          <p><strong>Owner Address:</strong> {contractAddress}</p>
          <p><strong>Your Account:</strong> {account}</p>
          <p><strong>Your Balance:</strong> {balance} ETH</p>
          
        </div>
        <div className="controls">
          <button onClick={deposit} className="action-button">Deposit 1 ETH</button>
          <button onClick={withdraw} className="action-button">Withdraw 1 ETH</button>
          <button onClick={burn} className="action-button">Burn 1 ETH</button>
          <button onClick={mint} className="action-button">Mint 1 ETH</button>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Ash's ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f0f8ff; /* Light blue background color */
          font-family: Arial, sans-serif;
        }
        header h1 {
          font-family: 'Courier New', monospace; /* Change the font */
          color: #331010; /* Change the color */
          font-style: italic;
          margin-bottom: 30px;
        }
        .header-buttons {
          margin-bottom: 20px;
          text-align: center;
        }
        .content {
        display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background-color: #ffffff; /* White content background */
          border: 1px solid #d3d3d3; /* Light gray border */
          border-radius: 8px;
          padding: 20px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Light shadow */
        }
        .info-box {
          background-color: #f0f0f0; /* Light gray background */
          border-radius: 5px;
          padding: 10px;
          margin-bottom: 20px;
        }
        .controls {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .action-button {
          margin: 5px;
          padding: 10px 20px;
          font-size: 16px;
          color: #ffffff; /* White text */
          background-color: #007bff; /* Blue button */
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .action-button:hover {
          background-color: #0056b3; /* Darker blue on hover */
        }
        .message {
          margin-top: 10px;
          font-style: italic;
          color: #555555; /* Gray message text */
        }
      `}
      </style>
    </main>
  )
}
