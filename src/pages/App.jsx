import { useState, useEffect } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xf9EC8e6242dEc244E8D6A055aCF2E215F04daD2F"; // Replace with actual address
const ABI = [
  "function deposit() public payable",
  "function withdraw(uint amount) public",
  "function checkBalance() public view returns (uint)",
  "function transferOwnership(address newOwner) public" // Added ABI for transferOwnership
];

export default function DApp() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [newOwner, setNewOwner] = useState(""); // State for new owner address
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
    };
    if (window.ethereum) {
      init();
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return alert("MetaMask is required!");
    const signer = await provider.getSigner();
    setAccount(await signer.getAddress());
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    setContract(contractInstance);
    fetchBalance(contractInstance);
  };

  const fetchBalance = async (contractInstance) => {
    if (!contractInstance) return;
    const bal = await contractInstance.checkBalance();
    setBalance(ethers.formatEther(bal));
  };

  const deposit = async () => {
    if (!contract) return;
    const tx = await contract.deposit({ value: ethers.parseEther(amount) });
    await tx.wait();
    fetchBalance(contract);
  };

  const withdraw = async () => {
    if (!contract) return;
    const tx = await contract.withdraw(ethers.parseEther(amount));
    await tx.wait();
    fetchBalance(contract);
  };

  const transferOwnership = async () => {
    if (!contract || !newOwner) return;
    try {
      const tx = await contract.transferOwnership(newOwner);
      await tx.wait();
      alert("Ownership transferred successfully!");
    } catch (error) {
      alert("Error transferring ownership: " + error.message);
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Decentralized Bank DApp</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask (Holesky)</button>
      ) : (
        <div>
          <p>Student ID: 65061447   Name: สมิทธ์ ทีปรัตนะ</p>
          <p>Connected Account: {account}</p>
          <p>Balance: {balance} ETH</p>
          <input 
            type="text" 
            placeholder="Amount in ETH" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={deposit}>Deposit</button>
          <button onClick={withdraw}>Withdraw</button>

          {/* New fields for transferring ownership */}
          <div className="mt-4">
            <input 
              type="text" 
              placeholder="New Owner Address" 
              value={newOwner} 
              onChange={(e) => setNewOwner(e.target.value)}
            />
            <button onClick={transferOwnership}>Transfer Ownership</button>
          </div>
        </div>
      )}
    </div>
  );
}




//<p>Student ID: 123456 | Name: John Doe</p>