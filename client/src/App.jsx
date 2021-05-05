import React, { useState, useEffect } from 'react';
import { getWeb3, getWallet } from './utils';
import Header from './Header';
import NewTransfer from './NewTransfer';
import TransferList from './transferList';

function App() {
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState([]);
  const [wallet, setWallet] = useState();
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState();
  const [activeAccount, setActiveAccount] = useState();
  const [transfers, setTransfers] = useState([]);
  const [isStale, setStale] = useState(true);
  const [balance, setBalance] = useState();

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);
      const approvers = await wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.quorum().call();
      const transfers = await wallet.methods.getTransfers().call();
      const selectedAddr = web3.eth.currentProvider.selectedAddress;
      const balance = await web3.eth.getBalance(selectedAddr);
      setWeb3(web3);
      setAccounts(accts);
      setWallet(wallet);
      setApprovers(approvers);
      setQuorum(quorum);
      setTransfers(transfers);
      setActiveAccount(selectedAddr);
      setBalance(balance);
      setStale(false);
      console.log('balance', balance)
      console.log('activeAcct', selectedAddr)
    }
    init();
  }, [isStale]);

  if (!wallet || !web3 || !accounts.length) {
    return (
      <div>
        Loading ...
      </div>
    );
  }

  const createTransfer = async transfer => {
    if (!activeAccount) {
      alert('Please set an active account');
    }
    await wallet.methods
      .createTransfer(transfer.amount, transfer.to)
      .send({from: activeAccount})
    setStale(true);
  }
  
  const approveTransfer = async transferId => {
    await wallet.methods
      .approveTransfer(transferId)
      .send({from: activeAccount})
    setStale(true);
  }

  window.ethereum.on('accountsChanged', accts => {
    accts.length && setActiveAccount(accts[0])
    setStale(true);
  })

  return (
    <div className="App">
      Multisig Dapp
      <hr />
      <Header
        approvers={approvers}
        quorum={quorum}
        activeAccount={activeAccount}
        balance={balance}
      />
      <TransferList 
        transfers={transfers}
        activeAccount={activeAccount}
        approve={approveTransfer}
      />
      <NewTransfer createTransfer={createTransfer} />
    </div>
  );
}

export default App;
