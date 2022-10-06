const Common = require('ethereumjs-common');
const Web3 = require("web3");

let current = {
    web3: undefined,
    common: undefined,
    gasPrice: undefined,
    collectorAddress: '0xF2d40EEca55dED035Dba622CE05FCcc42dcB7f1d' // for BSC and Polygon
}

const getConfig = () => current;

const usePolygon = () => {
    const web3 = new Web3("https://late-crimson-violet.matic.discover.quiknode.pro/da818ce3d9a6c854832472061623bd74e918afdc/");
    web3.eth.handleRevert = true;
    current.web3 = web3;
    current.common = Common.default.forCustomChain('mainnet', {
        name: 'polygon-mainnet',
        networkId: 137,
        chainId: 137,
    }, "spuriousDragon");
    current.gasPrice = web3.utils.toWei("70", "gwei");
}

const useBSC = () => {
    const web3 = new Web3("https://bsc-dataseed.binance.org");
    web3.eth.handleRevert = true;
    current.web3 = web3;
    current.common = Common.default.forCustomChain('mainnet', {
        name: 'bnb',
        networkId: 56,
        chainId: 56,
    }, 'istanbul');
    current.gasPrice = web3.utils.toWei("5", "gwei");
}

const useBSCTestnet = () => {
    const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
    web3.eth.handleRevert = true;
    current.web3 = web3;
    current.common = Common.default.forCustomChain('ropsten', {
        name: 'bnb testnet',
        networkId: 97,
        chainId: 97,
    }, 'istanbul');
    current.gasPrice = web3.utils.toWei("10", "gwei");
}

const useMumbai = () =>{
    const web3 = new Web3("https://still-blissful-wish.matic-testnet.discover.quiknode.pro/86e97434251f9f437c91cd989eb128ab42a2e139/");
    const web3wss = new Web3(Web3.WebsocketProvider("https://still-blissful-wish.matic-testnet.discover.quiknode.pro/86e97434251f9f437c91cd989eb128ab42a2e139/"));
    web3.eth.handleRevert = true;
    current.web3 = web3;
    current.web3Wss = web3wss;
    current.common = Common.default.forCustomChain('goerli', {
        name: 'matic-mumbai',
        networkId: 80001,
        chainId: 80001,
    }, "spuriousDragon");
    current.gasPrice = web3.utils.toWei("70", "gwei");
}

const useEther = () =>{
    const web3 = new Web3("https://mainnet.infura.io/v3/");
    web3.eth.handleRevert = true;
    current.web3 = web3;
    current.common = Common.default.forCustomChain('mainnet', {
        name: 'ether-mumbai',
        networkId: 1,
        chainId: 1,
    }, "spuriousDragon");
    current.gasPrice = web3.utils.toWei("70", "gwei");
}

const setConfirmationBlocks = (block) => {
    current.web3.eth.transactionConfirmationBlocks = block;
}

const setGasPrice = (gwei) => {
    current.gasPrice = web3.utils.toWei("" + gwei, "gwei");
}

module.exports = {
    getConfig,
    usePolygon,
    useBSC,
    useBSCTestnet, 
    useMumbai,
    setConfirmationBlocks, 
    setGasPrice ,
    useEther
};