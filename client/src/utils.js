import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider';
import Wallet from './contracts/Wallet.json';

const getWeb3 = () => {
    return new Promise(async (resolve, reject) => {
        let provider = await detectEthereumProvider();
        if (provider) {
            await provider.request({ method: 'eth_requestAccounts' });
            try {
                const web3 = new Web3(window.ethereum);
                resolve(web3);
            } catch (err) {
                reject(err)
            }
        }
        reject('Must install Metamask');
    });
};

const getWallet = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const contractDeployment = Wallet.networks[networkId];
    return new web3.eth.Contract(
        Wallet.abi,
        contractDeployment && contractDeployment.address
    )
}

export { getWeb3, getWallet };