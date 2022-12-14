const { Connection, clusterApiUrl, Keypair } = require("@solana/web3.js");
const bs58 = require('bs58')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const { default: axios } = require("axios");
const { transferNFT, getAllNftByOwner } = require("../../common/solana/nft");
const {runMutiThreadForLoop, waitFor, AppendDataToFile } = require("../../common/utils");
const ownerKeyPair = Keypair.fromSecretKey(bs58.decode(process.env.ACCOUNT1_PRIVATE_KEY));

//const connection = new Connection(clusterApiUrl("mainnet-beta"));

//TEST
const connection = new Connection(clusterApiUrl("devnet"));

main().catch(err => console.log(err))
let nfts = []
async function main(){
    // let { data } = await axios.get(`https://api.solscan.io/account/v2/tokenaccounts/total?address=${ownerKeyPair.publicKey}&cluster=`)
    // const totalNft = data.data
    // //get all nft
    // await runMutiThreadForLoop(totalNft, 0, getNfts)
    // transfer all nft
    //await runMutiThreadForLoop(nfts.length, 0, transferAllNft)

    //test
    nfts = await getAllNftByOwner(ownerKeyPair.publicKey)
    console.log('test', nfts.length)
    await runMutiThreadForLoop(nfts.length, 0, transferAllNft)
}

async function getNfts(start, end) {
    var dataHandle = [];
    var offset = start;
    let limit = 10
    do {
      const { data } = await axios.get(
        "https://api.solscan.io/account/v2/tokenaccounts",
        {
          params: {
            address: ownerKeyPair.publicKey,
            offset: offset,
            limit: limit,
            cluster: ''
          },
        }
      );
      dataHandle = data.data;
      for (let item of dataHandle) {
        if(item.tokenSymbol != 'MXM')
            continue
        nfts.push(item)
      }
      offset += 10;
      limit = (offset + 10 > end ) ? (end - offset) : 10
    } while (dataHandle != "[]" && offset <= end);
  }

async function transferAllNft(start, end){
    for(let i = start; i < end; i++){
        // if(nfts[i].tokenSymbol != 'MXM')
        //     continue
        // let tx = undefined
        // let callback = 0
        // while(tx == undefined && callback < 3){
        //   try {
        //     tx = await transferNFT(connection, ownerKeyPair, nfts[i].tokenAddress, 'ACPpwoSRF4B4Ftsjj9TAGxBmJwkHZNb13jnYdEiRshmA')
        //     console.log('tx', tx)
        //   } catch (error) {
        //     tx = undefined
        //     callback++
        //     await waitFor(1000)
        //     if(callback == 3){
        //       AppendDataToFile("error-transfer.txt", `${nfts[i].mintAddress.toBase58()}: ${error}  \n`);
        //     }
        //   }
        // }

        //TEST
        try {
          if(!nfts[i].name.includes('MXM')){
            continue
        }
        let tx = undefined
        let callback = 0
        while(tx == undefined && callback < 3){
          try {
            tx = await transferNFT(connection, ownerKeyPair, nfts[i].mintAddress, 'HbUfzDvVH3r5Y28i7U3XRCFfsud1ZwizaGKP5cAVgn9')
            console.log('tx', tx)
          } catch (error) {
            tx = undefined
            callback++
            console.log('callback', callback)
            await waitFor(1000)
            if(callback == 3){
              AppendDataToFile("error-transfer.txt", `${nfts[i].mintAddress.toBase58()}: ${error}  \n`);
            }
          }
        }
        } catch (error) {
          
        }
        
    }

}