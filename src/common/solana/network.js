const { Connection, clusterApiUrl } = require("@solana/web3.js");

let current = {
    connection : undefined
}

const getConfig = () => current

const useDevnet = () => {
    current.connection = new Connection(clusterApiUrl("devnet"));
}
const useTestnet = () => {
    current.connection = new Connection(clusterApiUrl("testnet"));
}
const useMainnet = () => {
    current.connection = new Connection(clusterApiUrl("mainnet-beta"));
}

module.exports = { useDevnet, useTestnet, useMainnet, getConfig }