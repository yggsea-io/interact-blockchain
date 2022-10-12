const {
  PublicKey,
} = require("@solana/web3.js");
const {
  getOrCreateAssociatedTokenAccount,
  transfer,
} = require("@solana/spl-token");
const { Metaplex, keypairIdentity } = require("@metaplex-foundation/js");
const axios = require("axios");
const {
  AppendDataToFile,
  getDataFromFileTxt,
  waitFor,
} = require("../utils");
const fs = require("fs");
const path = require("path");
const RESULT_PATH = path.join(__dirname, "./result.txt");

async function getAllNftByOwner(connection, owner) {
  const metaplex = new Metaplex(connection);
  const nft = await metaplex.nfts().findAllByOwner({ owner }).run();
  return nft;
}
async function getMetadataByOwner(connection, owner, symbol) {
  const nfts = await getAllNftByOwner(connection, owner);
  const heighStartEnd = parseInt(nfts.length / 10) + 1;
  var promises = [];
  var start = 0,
    end = heighStartEnd;
  for (let i = 0; i < 10; i++) {
    promises.push(getMetaDataFromUri(nfts, start, end, symbol));
    start = end;
    end = heighStartEnd + end > nfts.length ? nfts.length : heighStartEnd + end;
  }
  await Promise.all(promises);
  let result = await getDataFromFileTxt(RESULT_PATH);
  fs.unlinkSync(RESULT_PATH);
  return result;
}
async function getMetaDataFromUri(nfts, fromIdx, toIdx, symbol) {
  const result = [];
  for (let i = fromIdx; i < toIdx; i++) {
    if (nfts[i].symbol != symbol) continue;
    const { data } = await axios.get(nfts[i].uri);
    metadata = data;
    AppendDataToFile(RESULT_PATH, JSON.stringify(metadata) + "\n");
    result.push(metadata);
  }
  return result;
}

async function transferNFT(connection, fromWallet, mint, toWallet) {
    const toWalletPublicKey = new PublicKey(toWallet);
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    );
    console.log("fromTokenAccount", fromTokenAccount.address.toString());

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      toWalletPublicKey
    );

    console.log("toTokenAccount", toTokenAccount.address.toString());

    // Transfer the new token to the "toTokenAccount" we just created
    signature = await transfer(
      connection,
      fromWallet,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet,
      1,
      [],
      { skipPreflight: true, commitment: "processed" }
    );
    return signature;
}
async function createListNftTest(connection, owner, uriBase, symbol, total) {
  const metaplex = new Metaplex(connection);
  metaplex.use(keypairIdentity(owner));
  var heigh = parseInt(total / 10) + 1;
  const promises = [];
  var start = 0,
    end = heigh;
  for (let i = 0; i < 10; i++) {
    promises.push(createNft(start, end, metaplex, uriBase, symbol));
    start = end;
    end = heigh + end > total ? total : heigh + end;
  }
  await Promise.all(promises);
}

async function createNft(start, end, metaplex ,uriBase, symbol){
  for (let j = start; j < end; j++) {
    console.log('run: ', j)
    let mintNFTResponse = undefined;
    let runback = 0
    while (mintNFTResponse == undefined && runback < 3) {
      try {
        mintNFTResponse = await metaplex
          .nfts()
          .create({
            uri: uriBase,
            name: symbol + j,
            symbol: symbol,
            maxSupply: 1,
          })
          .run();
      } catch (error) {
        await waitFor(1000)
        runback ++
        if(runback == 3){
          console.log(`error:${j} : ${error}`);
        }
        mintNFTResponse = undefined;
      }
    }
  }
}

module.exports = {
  getAllNftByOwner,
  getMetadataByOwner,
  transferNFT,
  createListNftTest,
};
