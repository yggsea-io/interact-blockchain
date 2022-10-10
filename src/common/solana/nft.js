const { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } = require('@solana/spl-token');
const { Metaplex } = require("@metaplex-foundation/js");
const connection = new Connection(clusterApiUrl("mainnet-beta"));
const axios = require("axios");
const { AppendDataToFile, getDataFromFileTxt } = require("../utils");
const fs = require('fs')
const path = require('path')
const RESULT_PATH = path.join(__dirname, './result.txt')


async function getAllNftByOwner(owner){
    const metaplex = new Metaplex(connection)
    const nft = await metaplex.nfts().findAllByOwner({owner}).run();
    return nft
    
}
async function getMetadataByOwner(owner, symbol){
    const nfts = await getAllNftByOwner(owner)
    const heighStartEnd = parseInt(nfts.length / 10) + 1
    var promises = [];
    var start = 0, end = heighStartEnd
    for(let i = 0 ; i < 10 ; i++){
        promises.push(getMetaDataFromUri(nfts, start, end, symbol))
        start = end;
        end = (heighStartEnd + end > nfts.length) ? (nfts.length) : (heighStartEnd + end)
    }
    await Promise.all(promises)
    let result = await getDataFromFileTxt(RESULT_PATH)
    fs.unlinkSync(RESULT_PATH)
    return result
}
async function getMetaDataFromUri(nfts, fromIdx, toIdx, symbol){
    const result = []
    for (let i = fromIdx ; i< toIdx ; i++) {
        if (nfts[i].symbol != symbol) continue;
        const { data } = await axios.get(nfts[i].uri)
        metadata = data
        AppendDataToFile(RESULT_PATH, JSON.stringify(metadata) + "\n")
       result.push(metadata)
    }
    return result
}


async function transferNFT(connection, fromWallet, mint, toWallet) {
    const toWalletPublicKey = new PublicKey(toWallet)
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    );
    console.log('fromTokenAccount', fromTokenAccount.address.toString())

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        toWalletPublicKey
    );
    console.log('toTokenAccount', toTokenAccount.address.toString())

    // Transfer the new token to the "toTokenAccount" we just created
    signature = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet,
        1,
        [],
        { skipPreflight: true, commitment: 'processed' }
    );
    return signature;
}

module.exports = { transferNFT };

module.exports = {
  getAllNftByOwner,
  getMetadataByOwner,
  transferNFT
}