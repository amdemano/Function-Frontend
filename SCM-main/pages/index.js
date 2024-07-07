import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amount, setAmount] = useState(1);
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
      setMessage(`Deposited ${amount} ETH successfully!`);
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
      setMessage(`Withdrew ${amount} ETH successfully!`);
    }
  }

  const burn = async () => {
    if (atm) {
      let tx = await atm.burn(1);
      await tx.wait();
      getBalance();
      setMessage(`Burned ${amount} ETH successfully!`);
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
          <p><strong>Your Account:</strong> {account}</p>
          <p><strong>Contract Address:</strong> {contractAddress}</p>
          <p><strong>Your Balance:</strong> {balance} ETH</p>
        </div>
        <div className="controls">
          <button onClick={deposit} className="action-button">Deposit 1 ETH</button>
          <button onClick={withdraw} className="action-button">Withdraw 1 ETH</button>
          <button onClick={burn} className="action-button">Burn 1 ETH</button>
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
          text-align: center;
          background-color: #f0f8ff; /* Light blue background color */
          padding: 20px;
          border-radius: 10px;
        }
          header h1 {
          font-family: 'Courier New', monospace; /* Change the font */
          color: #331010; /* Change the color */
          font-style: italic;
          margin-bottom: 30px;
        }
        .content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .info-box {
          background-color: #e6f7ff;
          border: 1px solid #b3daff;
          padding: 10px;
          border-radius: 10px;
          margin-bottom: 20px;
          text-align: left; /* Align text to the left */
          width: fit-content; /* Adjust width to content */
        }
        .controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-grow: 1;
        }
        .action-button {
          margin: 5px;
          padding: 10px 20px;
          font-size: 16px;
          color: #fff;
          background-color: #007bff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .action-button:hover {
          background-color: #0056b3;
        }
        p {
          font-family: 'Georgia', serif;
          
        }
      `}
      </style>
    </main>
  )
}
