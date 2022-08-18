const ed = require('ed25519-hd-key');
const bip39 = require('bip39');
const anchor = require('@project-serum/anchor');
const SolanaAccount = require("./account")

class SolanaManager {
    constructor(mnemonic, nAccount = 1){
        const seed = bip39.mnemonicToSeedSync(mnemomic).slice(0, 32);
        this.accounts = {}
        this.addressByIdx = {}
        this.addressIdx = {}
        this.nAccount = nAccount
    }

    getKeypair = (mnemonic, i) => {
        return anchor.web3.Keypair.fromSeed(derivedSeed.slice(0, 32));
    }

    init() {
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        for(var i = 0 ; i< nAccount ; i ++){
            const path = `m/44'/501'/${i}'/0'`;
            const derivedSeed = ed.derivePath(path, seed.toString('hex')).key;
            const Keypair = anchor.web3.Keypair.fromSeed(derivedSeed.slice(0, 32));
            const address = Keypair.publicKey.toBase58().toLowerCase()
            this.accounts[address] = new SolanaAccount(Keypair)
            this.addressByIdx[i] = address
            this.addressIdx[address] = i
        }
    }

    getKeypair(address){
        return this.keypairs[address.toLowerCase()]
    }
    
    getAddressByIdx(index){
        return this.addressByIdx[index]
    }
    getAddressIdx(address){
        return this.addressByIdx[address.toLowerCase]
    }
}

module.exports = SolanaManager  